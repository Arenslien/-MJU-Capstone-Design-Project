# 라이브러리 임포트
import numpy as np
import argparse
from sklearn.utils.extmath import randomized_svd # 3.1 메소드용 라이브러리
from sklearn import preprocessing as prep
from sklearn import datasets
import scipy.sparse as sp
import scipy
from sklearn.metrics.pairwise import cosine_similarity # 3.2 메소드용 라이브러리
import torch # 3.3 메소드용 라이브러리
import pandas as pd # 3.4 메소드용 라이브러리

def tfidf(x):
  """
  compute tfidf of numpy array x
  :param x: input array, document by terms
  :return:
  """
  x_idf = np.log(x.shape[0] - 1) - np.log(1 + np.asarray(np.sum(x > 0, axis=0)).ravel())
  x_idf = np.asarray(x_idf)
  x_idf_diag = scipy.sparse.lil_matrix((len(x_idf), len(x_idf)))
  x_idf_diag.setdiag(x_idf)
  x_tf = x.tocsr()
  x_tf.data = np.log(x_tf.data + 1)
  x_tfidf = x_tf * x_idf_diag
  return x_tfidf

def prep_standardize(x):
  """
  takes sparse input and compute standardized version

  Note:
    cap at 5 std

  :param x: 2D scipy sparse data array to standardize (column-wise), must support row indexing
  :return: the object to perform scale (stores mean/std) for inference, as well as the scaled x
  """
  x_nzrow = x.any(axis=1)
  scaler = prep.StandardScaler().fit(x[x_nzrow, :])
  x_scaled = np.copy(x)
  x_scaled[x_nzrow, :] = scaler.transform(x_scaled[x_nzrow, :])
  x_scaled[x_scaled > 5] = 5
  x_scaled[x_scaled < -5] = -5
  x_scaled[np.absolute(x_scaled) < 1e-5] = 0
  return scaler, x_scaled

# 3.0.1 libsvm data --> vector
def convert_libsvm_to_vector(libsvm_data):
  libsvm_data = tfidf(libsvm_data)

  u, s, _ = randomized_svd(libsvm_data, n_components=300, n_iter=5)
  libsvm_data = u * s
  _, libsvm_data = prep_standardize(libsvm_data)

  if sp.issparse(libsvm_data):
    vectors = libsvm_data.tolil(copy=False)
  else:
    vectors = libsvm_data

  return vectors

# 3.0.2 datafram --> libsvm format file
def convert_new_user_to_libsvm(new_user):
  """
  libsvm 포맷의 파일로 저장된 user information 값을
  Numpy Array로 변환하는 메소드

  Input
  - new_user: new_user ndarray --> ex) [UserID, GENDER, AGE_GRP, TRAVEL_STYL_1, TRAVEL_STYL_5, TRAVEL_STYL_6]
  - save_dir new_user_libsvm.txt 파일을 저장하기 위한 경로

  Output: new_user_libsvm.txt 파일 경로
  """

  # labe, features 값 분리, libsvm_format 선언
  label = new_user[0]
  features = new_user[1:]
  libsvm_format = f"{label} "

  # libsvm_format 맞게 index:value 추가
  for i, feature_value in enumerate(features):
    libsvm_format += f"{i+1}:{feature_value} "
  libsvm_format = libsvm_format.strip()

  output_dir = "D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\new_user_libsvm.txt" # 저장할 경로
  origin_libsvm_dir = "D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\travel-log\\user_features_0based.txt"

  # 결과 출력
  with open(output_dir, "w") as output_file:
    output_file.write("0\n")
    output_file.write(f"{libsvm_format}\n")

    with open(origin_libsvm_dir, "r") as origin_libsvm_file:
      for i, line in enumerate(origin_libsvm_file):
        if i != 0:
          output_file.write(f"{line.strip()}\n")

  return output_dir

# 3.1 create_standardized_user_vector method
def create_standardized_user_vectors(libsvm_dir):
  """
  libsvm 포맷의 파일로 저장된 user information 값을
  Numpy Array로 변환하는 메소드

  Input: libsvm format file directory
  Output: old_user의 값을 vector화 한 array
  """
  # 3.1.1 libsvm format file 불러오기
  user_content, _ = datasets.load_svmlight_file(libsvm_dir, zero_based=True, dtype=np.float32)

  # 3.1.2 libsvm format --> standardized vector로 변환
  user_vectors = convert_libsvm_to_vector(user_content)

  return user_vectors

# 3.2 get_top_K_similar_user method
def get_top_K_similar_user(new_user_vector, old_user_vectors, K):
  """
  new_user와 old_user에 대한 유사도 값을 구한 후
  Top K개

  Input
  - new_user_raw_vector: 새로운 유저 정보에 대한 numpy array 값
  - old_user_vectors: create_user_info_array의 Output
  - k: top K개 추출에 대한 값

  Output
  - similar_users: new_user와 가장 유사한 old_users top K개
  """
  # 3.2.1 new_user와 oldusers 간에 cosine_similarity값 구하기
  similarities = cosine_similarity(new_user_vector, old_user_vectors)
  # print("3.2.4")
  # print(similarities)
  # print(similarities.shape)

  # 3.2.2 Top K개의 similar user 추출
  top_K_similar_user_index = similarities.argsort()[0][-(K+1):][::-1][1:]

  # 3.2.3 Method 결과값 출력
  # print(f"[Method: get_similar_users()] - Top K개 Similar User Index")
  # for idx in top_K_similar_user_index:
  #   print(f"- Similar User {idx}: {similarities[0][idx]}")

  return top_K_similar_user_index

# 3.3 get_top_K_travel_area method
def get_top_K_travel_area(embedding_dir, top_K_similar_user_index, K):
  """
  Top K개의 추천 관광지 인덱스를 반환하는 메소드

  Input
  - embedding_dir: rating matirx를 구하기 위해 저장된 embedding vector 경로
  - top_K_similar_user_index: 유사한 유저 인덱스 Top K 개 리스트

  Output
  - top_K_recommend_area_index: 추출된 Top K개 추천 관광지 인덱스 리스트
  """
  # 3.3.0
  top_K_recommend_area_value = []
  top_K_recommend_area_index = []

  # 3.3.1 embedding_dir에서 U_embedding, V_embedding 값 가져오기
  U_embedding = np.loadtxt(embedding_dir + "/U_embedding.txt")
  V_embedding = np.loadtxt(embedding_dir + "/V_embedding.txt")

  top_K_U_embedding = U_embedding[top_K_similar_user_index]

  # 3.3.2 Rating Matrix 계산
  top_K_U_embedding = torch.tensor(top_K_U_embedding)
  V_embedding = torch.tensor(V_embedding)

  rating_matrix = torch.matmul(top_K_U_embedding, V_embedding.t())

  # 3.3.3 top_K_similar_user_index에 해당하는 rating 값만 가져오기
  for user_ratings in rating_matrix:
    top_K_value, top_K_index = torch.topk(user_ratings, K)

    # 3.3.4 각 similar_user 별 top K or threshold 이상의 visit area id 가져오기
    for idx, value in enumerate(top_K_value):
      threshold = 0.5
      if value > threshold:
        top_K_recommend_area_value.append(value.item())
        top_K_recommend_area_index.append(top_K_index[idx].item())

  # 3.3.5 visit_area_id 출력
  # print(f"[Method: get_top_K_travel_area()] - Top K개 Recommended Area Index")
  # for idx, value in enumerate(top_K_recommend_area_value):
  #   print(f"- Similar User {top_K_recommend_area_index[idx]}: {value}")

  return top_K_recommend_area_index, top_K_recommend_area_value

# 3.4 combine_area_index_and_information method
def combine_area_index_and_information(top_K_recommend_area_index, area_information_dir):
  """
  new_user와 old_user에 대한 유사도 값을 구한 후
    Top K개

    Input
    - top_K_recommend_area_index: 추천하고자 하는 지역 인덱스 리스트
    - area_information_dir: 지역 정보가 담긴 파일의 디렉토리

    Output
    - top_K_area_info_df: top_K_recommend_area_index에 해당하는 지역 정보 데이터프레임
  """
  # 3.4.1 area_information 파일 데이터프레임으로 가져오기
  all_area_info_df = pd.read_csv(area_information_dir)

  # 3.4.2 top_K_recommend_area_index에 해당하는 row만 추출
  top_K_area_info_df = all_area_info_df[all_area_info_df['ITEM_ID'].isin(top_K_recommend_area_index)]

  # 3.4.3 최종 결과값 return
  return top_K_area_info_df

if __name__=="__main__":
  print("[START : get_recommend_result.py]")
  # Goal: Input User에 대한 Similar User의 Tour Spot 제공

  # 0. parser 설정
  parser = argparse.ArgumentParser(
    description="Demo script to get Recommend Result on Trained DropoutNet", 
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--user-information', nargs='+', type=int, help='List of User information integers')
  args = parser.parse_args()

  # 1. Input User Information --> libsvm format --> standardized vector로 변환
  new_user_raw_vector = args.user_information # list
  new_user_libsvm_dir = convert_new_user_to_libsvm(new_user_raw_vector)
  new_user_vectors = create_standardized_user_vectors(new_user_libsvm_dir)
  new_user_vector = new_user_vectors[0].reshape(1, -1) # new_user 값만 추출

  # 2. Old User Information --> libsvm format --> standardized vector로 변환
  libsvm_dir = "D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\travel-log/user_features_0based.txt"
  old_user_vectors = create_standardized_user_vectors(libsvm_dir)

  # 3. Input User와 유사한 Old User 10명 추출
  top_K_similar_user_index = get_top_K_similar_user(new_user_vector, old_user_vectors, 10)

  # 4. Similar Old User 기반 Tour Spot Index 추출
  embedding_dir = "D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\checkpoint/Embedded-latent-factor"
  top_K_recommend_area_index, _ = get_top_K_travel_area(embedding_dir, top_K_similar_user_index, 10) # index, rating(top_K_recommend_area_value)

  # 5. Index에 대한 Tour-spot information 추가
  area_information_dir = "D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\travel-log\\tour-spot-information\\all-area-info.csv"
  top_K_area_info_df = combine_area_index_and_information(top_K_recommend_area_index, area_information_dir)

  # 6. json 파일 저장
  top_K_area_info_df.to_json("D:\\Programming\\MJU-CapstoneDesign-Project\\model\\dropout-net\\recommend-result\\result.json", orient="records")

  print("[FINISH : get_recommend_result.py]")