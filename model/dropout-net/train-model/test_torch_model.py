import numpy as np
import pandas as pd
import scipy
import torch
import torch.nn as nn
import datetime
from sklearn import datasets
from tqdm import tqdm
import argparse
import os
import scipy.sparse as sp
import utils
import data
import model
import datetime

# 기본 세팅
n_users             = 11686 + 1 # train 데이터 개수
n_items             = 9716 + 1 # train 데이터 개수
latent_rank_in      = 200
user_content_rank   = 6
model_select        = [200] # default
rank_out            = 200
recall_at           = range(10, 110, 10)
n_scores_user       = 1000
eval_batch_size     = 1000
user_batch_size     = 1000

def load_data(data_path):
    timer = utils.timer(name='main').tic()
    split_folder = os.path.join(data_path, 'cold')

    # u, v file은 WRMF 적용된 Latent vector
    u_file                  = os.path.join(data_path, 'trained/cold/WRMF_U.txt')
    v_file                  = os.path.join(data_path, 'trained/cold/WRMF_V.txt')
    
    # item content file은 libsvm format file
    user_content_file       = os.path.join(data_path, 'user_features_0based.txt')
    
    # train, test, test_item_id 파일
    # train_file              = os.path.join(split_folder, 'train.csv')
    # test_cold_file          = os.path.join(split_folder, 'test.csv')
    # test_cold_iid_file      = os.path.join(split_folder, 'test_item_ids.csv')
    # zero_file              = os.path.join(split_folder, 'zero.csv')
    # all_cold_file          = os.path.join(split_folder, 'all.csv')
    # all_cold_iid_file      = os.path.join(split_folder, 'all_item_ids.csv')

    dat = {}
    # load preference data
    timer.tic()
    
    
    u_pref = np.loadtxt(u_file).reshape(n_users,200)
    v_pref = np.loadtxt(v_file).reshape(n_items,200)
    
    dat['u_pref'] = u_pref
    dat['v_pref'] = v_pref

    timer.toc('loaded U:%s,V:%s' % (str(u_pref.shape), str(v_pref.shape))).tic()

    # pre-process
    _, dat['u_pref_scaled'] = utils.prep_standardize(u_pref)
    _, dat['v_pref_scaled'] = utils.prep_standardize(v_pref)
    
    timer.toc('standardized U,V').tic()

    # load content data
    timer.tic()
    
    # user_content 로드하기
    user_content, _ = datasets.load_svmlight_file(user_content_file, zero_based=True, dtype=np.float32)
    
    user_content = utils.tfidf(user_content)
    
    from sklearn.utils.extmath import randomized_svd
    u,s,_ = randomized_svd(user_content, n_components=300, n_iter=5)
    user_content = u * s
    _, user_content = utils.prep_standardize(user_content)
    
    if sp.issparse(user_content):
        dat['user_content'] = user_content.tolil(copy=False)
    else:
        dat['user_content'] = user_content
    
    timer.toc('loaded user feature sparse matrix: %s' % (str(user_content.shape))).tic()
    
    # Item_content 로드하기
    # item_content, _ = datasets.load_svmlight_file(item_content_file, zero_based=True, dtype=np.float32)
    # dat['item_content'] = item_content.tolil(copy=False)
    # timer.toc('loaded item feature sparse matrix: %s' % (str(item_content.shape))).tic()

    # load split
    timer.tic()
    
    # pdr.read_csv() header의 ValueError로 추가한 코드.
    # travel_log_zero_df = pd.read_csv(zero_file, delimiter=",", header=None);
    # zero = travel_log_train_df.values.ravel().view(dtype=[('uid', np.int32), ('iid', np.int32), ('inter', np.int32)])
    # zero = None
    # print(zero)
    
    # dat['user_indices'] = np.unique(zero['uid'])
    # timer.toc('read zero triplets %s' % zero.shape).tic()

    # all_data 불러오는 코드, batch_eval_recall의 인자 값
    # dat['all_data'] = data.load_eval_data(all_cold_file, all_cold_iid_file, name='all_data', cold=True, train_data=zero)
    
    return dat
    
if __name__ == "__main__":
    print("[TEST_MODEL START]")
    
    # PARSER
    parser = argparse.ArgumentParser(description="Script to test DropoutNet Model", formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--data-dir', type=str, required=True, help='path to eval in the downloaded folder')
    parser.add_argument('--checkpoint-path', type=str, default=None,
                        help='path to load checkpoint data from TensorFlow')
    parser.add_argument('--model-device', type=str, default='cuda', help='device to use for training')
    parser.add_argument('--inf-device', type=str, default='cpu', help='device to use for inference')
    
    args = parser.parse_args()
    args, _ = parser.parse_known_args()
    
    d_train = torch.device(args.model_device)
    d_eval = torch.device(args.inf_device)
    data_path = args.data_dir
    
    # 1. 모델 선언
    dropout_net = model.get_model(
        latent_rank_in=latent_rank_in,
        user_content_rank=user_content_rank,
        item_content_rank=0,
        model_select=model_select,
        rank_out=rank_out
    )
    
    # 2. 저장된 모델 불러오기
    checkpoint_path = args.checkpoint_path
    print(checkpoint_path)
    checkpoint = torch.load(checkpoint_path, map_location=torch.device('cpu'))
    
    # 3. 모델에 저장된 상태 적용
    dropout_net.load_state_dict(checkpoint['model_state_dict'])
    dropout_net.eval() # 추론 모드 설정
    
    # 4. 데이터 준비
    dat = load_data(data_path)
    u_pref = dat['u_pref']
    v_pref = dat['v_pref']
    u_pref_scaled = dat['u_pref_scaled']
    v_pref_scaled = dat['v_pref_scaled']
    user_content = dat['user_content']
    
    # all_data.init_tf(u_pref_scaled, v_pref_scaled, user_content, None, eval_batch_size)
    
    # 5. rating_matrix 구하기
    u_pref_expanded = np.vstack([u_pref_scaled, np.zeros_like(u_pref_scaled[0, :])])
    v_pref_expanded = np.vstack([v_pref_scaled, np.zeros_like(v_pref_scaled[0, :])])
    
    Uin = u_pref_expanded[:-1, :]
    Vin = v_pref_expanded[:-1, :]
    Ucontent = user_content
    Vcontent = None
    
    Uin = torch.tensor(Uin).to(d_eval)
    Vin = torch.tensor(Vin).to(d_eval)
    Ucontent = torch.tensor(Ucontent).to(d_eval)
    # Vcontent = torch.tensor(Vcontent).to(d_train)
    
    U_embedding, V_embedding = dropout_net.get_embedding(Uin, Vin, Ucontent, Vcontent)
    
    U_embedding = U_embedding.detach().numpy()
    V_embedding = V_embedding.detach().numpy()

    print(U_embedding)
    print(U_embedding.shape)
    
    print(V_embedding)
    print(V_embedding.shape)
    
    # 6. 결과 추출
    np.savetxt("../checkpoint/Embedded-latent-factor/U_embedding.txt", U_embedding)
    print("[U_embedding is saved]")
    
    np.savetxt("../checkpoint/Embedded-latent-factor/V_embedding.txt", V_embedding)
    print("[V_embedding is saved]")
    
    print("[TEST_MODEL END]")