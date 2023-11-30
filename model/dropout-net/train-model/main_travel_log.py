import numpy as np
import pandas as pd
import scipy
import torch
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

n_users = 11686 + 1 # train 데이터 개수
n_items = 9716 + 1 # train 데이터 개수

def main():
    #####################################################################
    # 1. 초기 값 설정                                                   #
    #####################################################################
    
    # 1.1 초기 입력 argument 선언
    data_path           = args.data_dir
    checkpoint_path     = args.checkpoint_path
    tb_log_path         = args.tb_log_path
    model_select        = args.model_select

    # 1.2 모델 관련 파라미터 값
    rank_out            = args.rank
    user_batch_size     = 1000
    n_scores_user       = 1000 # default:2500, 
    data_batch_size     = 100
    dropout             = args.dropout
    recall_at           = range(10, 110, 10)
    eval_batch_size     = 1000
    max_data_per_step   = 2500000
    eval_every          = args.eval_every
    num_epoch           = 10

    _lr = args.lr
    _decay_lr_every = 100
    _lr_decay = 0.1

    # 1.3 모델 실험 일시 & DNN 모델 구조 설명 ex) 일시_200-100-50 구조
    experiment = '%s_%s' % (
        datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'),
        '-'.join(str(x / 100) for x in model_select) if model_select else 'simple'
    )
    print('running: ' + experiment)

    #####################################################################
    # 2. 데이터 불러오기                                                #
    #####################################################################
    
    dat = load_data(data_path)
    u_pref_scaled = dat['u_pref_scaled']
    v_pref_scaled = dat['v_pref_scaled']
    eval_cold = dat['eval_cold'] # 바꿔야 할듯
    
    user_content = dat['user_content']
    item_content = None # dat['item_content']
    u_pref = dat['u_pref']
    v_pref = dat['v_pref']
    user_indices = dat['user_indices']

    timer = utils.timer(name='main').tic() # 모델 훈련 전 Main Timer 시작 시간 설정

    # append pref factors for faster dropout
    v_pref_expanded = np.vstack([v_pref_scaled, np.zeros_like(v_pref_scaled[0, :])])
    v_pref_last = v_pref_scaled.shape[0]
    u_pref_expanded = np.vstack([u_pref_scaled, np.zeros_like(u_pref_scaled[0, :])])
    u_pref_last = u_pref_scaled.shape[0]
    timer.toc('initialized numpy data')

    # prep eval
    eval_batch_size = eval_batch_size
    timer.tic()
    # item_content --> None 처리 (만약 생기면 다시 선언)
    eval_cold.init_tf(u_pref_scaled, v_pref_scaled, user_content, None, eval_batch_size)
    timer.toc('initialized eval_cold').tic()
    
    
    #####################################################################
    # 3. 모델 설정                                                      #
    #####################################################################
    
    # item_content 생길 경우 item_content.shape[1] 할당
    dropout_net = model.get_model(
        latent_rank_in=u_pref.shape[1],
        user_content_rank=user_content.shape[1],
        item_content_rank=0,
        model_select=model_select,
        rank_out=rank_out
    )

    # Torch에 맞게 추가된 부분이 있음
    row_index = np.copy(user_indices) 
    n_step = 0
    best_cold = 0
    n_batch_trained = 0
    best_step = 0
    optimizer = torch.optim.SGD(dropout_net.parameters(), args.lr, momentum=0.9)
    crit = torch.nn.MSELoss()
    d_train = torch.device(args.model_device)
    d_eval = torch.device(args.inf_device)

    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=_decay_lr_every, gamma=_lr_decay)
    dropout_net.to(d_train)
    dropout_net.train()

    #####################################################################
    # 4. 모델 훈련                                                      #
    #####################################################################
    
    for epoch in range(num_epoch):
        print("="*70)
        print(f"[MAIN EPOCH : {epoch+1}]")
        print("="*70)
        
        # 4.1 row_index 셔플
        np.random.shuffle(row_index)
        
        for b in utils.batch(row_index, user_batch_size):
            # b는 1000(user_batch_size)개 단위로 쪼개진 index들
            
            n_step += 1
            # prep targets
            target_users = np.repeat(b, n_scores_user) # 1000개 1000
            target_users_rand = np.repeat(np.arange(len(b)), n_scores_user)
            target_items_rand = [np.random.choice(v_pref.shape[0], n_scores_user) for _ in b]
            target_items_rand = np.array(target_items_rand).flatten()
            target_ui_rand = np.transpose(np.vstack([target_users_rand, target_items_rand]))
            
            # 4.2 예측 평점 행렬 구하기
            preds_pref = np.matmul(u_pref[b, :], v_pref.T) # batch_size, shuffle된 User 기준으로 계산된 Rating_matrix 
            # print(preds_pref)
            #  [[ 0.          0.01697649  0.03291814 ...  0.02044134 -0.05279968
            #   0.0174098 ]
            #  [ 0.          0.00683479 -0.05129104 ... -0.01468345  0.01101841
            #   -0.00970749]
            #  [ 0.         -0.00265203 -0.03299914 ...  0.01389039 -0.01890002
            #   -0.01049241]
            #  ...
            #  [ 0.          0.00644108  0.03739153 ...  0.00943636  0.00388762
            #   0.03280299]
            #  [ 0.          0.06079676 -0.00193712 ... -0.01674999  0.09177202
            #   -0.00829206]
            #  [ 0.          0.02990254  0.02809358 ... -0.02544078  0.02342696
            #   -0.00397157]]
            
            preds_pref = torch.tensor(preds_pref)
            target_scores, target_items = torch.topk(preds_pref, k=n_scores_user, sorted=True)
            random_scores = preds_pref.detach().cpu().numpy()[target_ui_rand[:,0],target_ui_rand[:,1]]

            # merge topN and randomN items per user
            target_scores = np.append(target_scores, random_scores)
            target_items = np.append(target_items, target_items_rand)
            target_users = np.append(target_users, target_users)
            
            n_targets = len(target_scores)
            perm = np.random.permutation(n_targets)
            n_targets = min(n_targets, max_data_per_step)
            data_batch = [(n, min(n + data_batch_size, n_targets)) for n in range(0, n_targets, data_batch_size)]
            
            f_batch = 0
            pbar = tqdm(data_batch, desc='ubatch')
            
            for (start, stop) in pbar:
                batch_perm = perm[start:stop]
                batch_users = target_users[batch_perm]
                batch_items = target_items[batch_perm]
                
                if dropout != 0:
                    n_to_drop = int(np.floor(dropout * len(batch_perm)))
                    perm_user = np.random.permutation(len(batch_perm))[:n_to_drop]
                    perm_item = np.random.permutation(len(batch_perm))[:n_to_drop]
                    batch_v_pref = np.copy(batch_items)
                    batch_u_pref = np.copy(batch_users)
                    batch_v_pref[perm_user] = v_pref_last
                    batch_u_pref[perm_item] = u_pref_last
                else:
                    batch_v_pref = batch_items
                    batch_u_pref = batch_users
                    
                user_content_batch = user_content[batch_users, :]
                if sp.issparse(user_content):
                    user_content_batch = user_content_batch.todense()
                    
                # item_content_batch = item_content[batch_items, :]
                # if sp.issparse(item_content):
                #     item_content_batch = item_content_batch.todense()

                # 예측값 구하기 
                Uin = u_pref_expanded[batch_u_pref, :]
                Vin = v_pref_expanded[batch_v_pref, :]
                Ucontent = user_content_batch
                Vcontent = None # item_content_batch
                targets = target_scores[batch_perm]
                
                Uin = torch.tensor(Uin).to(d_train)
                Vin = torch.tensor(Vin).to(d_train)
                Ucontent = torch.tensor(Ucontent).to(d_train)
                # Vcontent = torch.tensor(Vcontent).to(d_train)
                targets = torch.tensor(targets).to(d_train)
                
                preds, U_embedding, V_embedding = dropout_net.forward(Uin, Vin, Ucontent, Vcontent)
                
                loss = crit(preds, targets.to(torch.float32))
                loss_out = loss.item()
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                f_batch += loss_out
                
                if np.isnan(f_batch):
                    raise Exception('f is nan')
                n_batch_trained += 1
                pbar.set_description(f'updates={n_batch_trained/1000:.0f}k f={loss_out:.4f} f_tot={f_batch:.2f}')
            # step after every ubatch, decay is based on # of ubatch
            scheduler.step()

            if n_step % eval_every == 0:
                dropout_net.to(d_eval)
                dropout_net.eval()

                recall_cold = dropout_net.evaluate(recall_k=recall_at, eval_data=eval_cold, device=d_eval)

                dropout_net.to(d_train)
                dropout_net.train()

                # checkpoint
                agg_cur = np.sum(recall_cold) 
                agg_best = np.sum(best_cold)
                if agg_cur > agg_best:
                    best_cold = recall_cold
                    best_step      = n_step
                    
                    # 현재 시간 정보 가져오기
                    current_time = datetime.datetime.now()
                    current_checkpoint_path = checkpoint_path + current_time.strftime("%m-%d-%H-%M-%S") + "_checkpoint.pth"

                    # 모델 저장
                    torch.save({
                        'model_state_dict': dropout_net.state_dict(),
                        'optimizer_state_dict': optimizer.state_dict(),
                    }, current_checkpoint_path)

                timer.toc('%d [%d]b [%d]tot f=%.2f best[%d]' % (
                    n_step, len(data_batch), n_batch_trained, f_batch, best_step
                )).tic()
                print ('\t\t\t'+' '.join([('@'+str(i)).ljust(6) for i in recall_at]))
                print('cold start\t%s' % (
                    ' '.join(['%.4f' % i for i in recall_cold]),
                ))


def load_data(data_path):
    timer = utils.timer(name='main').tic()
    split_folder = os.path.join(data_path, 'cold')

    # u, v file은 WRMF 적용된 Latent vector
    u_file                  = os.path.join(data_path, 'trained/cold/WRMF_U.txt')
    v_file                  = os.path.join(data_path, 'trained/cold/WRMF_V.txt')
    
    # item content file은 libsvm format file
    user_content_file       = os.path.join(data_path, 'user_features_0based.txt')
    # item_content_file       = os.path.join(data_path, 'item_features_0based.txt')
    
    # train, test, test_item_id 파일
    train_file              = os.path.join(split_folder, 'train.csv')
    test_cold_file          = os.path.join(split_folder, 'test.csv')
    test_cold_iid_file      = os.path.join(split_folder, 'test_item_ids.csv')

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
    travel_log_train_df = pd.read_csv(train_file, delimiter=",", header=None);
    train = travel_log_train_df.values.ravel().view(dtype=[('uid', np.int32), ('iid', np.int32), ('inter', np.int32)])
    
    dat['user_indices'] = np.unique(train['uid'])
    timer.toc('read train triplets %s' % train.shape).tic()

    # eval_cold 불러오는 코드, batch_eval_recall의 인자 값
    dat['eval_cold'] = data.load_eval_data(test_cold_file, test_cold_iid_file, name='eval_cold', cold=True, train_data=train) # citeu=False
    
    return dat

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Demo script to run DropoutNet on TRAVEL LOG data",
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--data-dir', type=str, required=True, help='path to eval in the downloaded folder')

    parser.add_argument('--model-device', type=str, default='cuda:0', help='device to use for training')
    parser.add_argument('--inf-device', type=str, default='cpu', help='device to use for inference')
    parser.add_argument('--checkpoint-path', type=str, default=None,
                        help='path to dump checkpoint data from Pytorch')
    parser.add_argument('--tb-log-path', type=str, default=None,
                        help='path to dump TensorBoard logs')
    parser.add_argument('--model-select', nargs='+', type=int,
                        default=[200],
                        help='specify the fully-connected architecture, starting from input,'
                             ' numbers indicate numbers of hidden units',
                        )
    parser.add_argument('--rank', type=int, default=200, help='output rank of latent model')
    parser.add_argument('--dropout', type=float, default=0.5, help='DropoutNet dropout')
    parser.add_argument('--eval-every', type=int, default=1, help='evaluate every X user-batch')
    parser.add_argument('--lr', type=float, default=0.005, help='starting learning rate')

    args = parser.parse_args()
    main()
    
    print("[MAIN_COLD_TRAVEL_LOG.py is finished]")