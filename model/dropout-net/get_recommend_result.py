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

  output_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/recommended-result//new_user_libsvm.txt" # 저장할 경로
  origin_libsvm_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/dropout-net/travel-log/user_features_0based.txt"

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

  # 3.2.2 Top K개의 similar user 추출
  top_K_similar_user_index = similarities.argsort()[0][-(K+1):][::-1][1:]

  return top_K_similar_user_index

# 3.3 get_top_K_travel_area method
def get_top_K_travel_area(embedding_dir, top_K_similar_user_index, week):
  """
  Top K개의 추천 관광지 인덱스를 반환하는 메소드

  Input
  - embedding_dir: rating matirx를 구하기 위해 저장된 embedding vector 경로
  - top_K_similar_user_index: 유사한 유저 인덱스 Top K 개 리스트

  Output
  - top_K_recommend_area_index: 추출된 Top K개 추천 관광지 인덱스 리스트
  """

  # 3.3.1 embedding_dir에서 U_embedding, V_embedding 값 가져오기
  U_embedding = np.loadtxt(embedding_dir + "/U_embedding.txt")
  V_embedding = np.loadtxt(embedding_dir + "/V_embedding.txt")

  top_K_U_embedding = U_embedding[top_K_similar_user_index]

  # 3.3.2 Rating Matrix 계산
  top_K_U_embedding = torch.tensor(top_K_U_embedding)
  V_embedding = torch.tensor(V_embedding)

  rating_matrix = torch.matmul(top_K_U_embedding, V_embedding.t())
  print(rating_matrix)

  # 3.3.3 Rating Matrix 중 Max 값 계산
  max_rating_matrix, _ = torch.max(rating_matrix, dim=0)

  # 3.3.4 AREA_GROUP 기준 JOIN 진행
  max_rating_matrix_df = pd.DataFrame({'ITEM_ID': range(1, len(max_rating_matrix) + 1), 'RATING': max_rating_matrix.tolist()}) # 텐서를 DataFrame으로 변환
  max_rating_matrix_df.index += 1 # 인덱스를 1부터 시작하도록 설정
  print(max_rating_matrix_df)

  area_information_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/dropout-net/travel-log/tour-spot-information/all-area-info-photo.csv"
  area_info_df = pd.read_csv(area_information_dir)

  joined_df = pd.merge(max_rating_matrix_df, area_info_df[["ITEM_ID", "VISIT_AREA_NM","AREA_GROUP", "X_COORD", "Y_COORD"]], on="ITEM_ID")

  # 3.3.5 Filtering
  filtered_df = joined_df.groupby("AREA_GROUP").apply(lambda x: x.sort_values("RATING", ascending=False).head(3 * week))

  return filtered_df

if __name__=="__main__":
  print("[START : get_recommend_result.py]")
  # Goal: Input User에 대한 Similar User의 Tour Spot 제공

  # 0. parser 설정
  parser = argparse.ArgumentParser(
    description="Demo script to get Recommend Result on Trained DropoutNet", 
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--user-information', nargs='+', type=int, required=True, help='List of User information integers')
  parser.add_argument('--period', type=int, required=True, help="Workation Period")
  args = parser.parse_args()

  # 1. Input User Information --> libsvm format --> standardized vector로 변환
  new_user_raw_vector = args.user_information # list
  week = 4 if ((args.period - 1) // 7 + 1) > 4 else ((args.period - 1) // 7 + 1)
  print("week:", week)
  
  new_user_libsvm_dir = convert_new_user_to_libsvm(new_user_raw_vector)
  new_user_vectors = create_standardized_user_vectors(new_user_libsvm_dir)
  new_user_vector = new_user_vectors[0].reshape(1, -1) # new_user 값만 추출

  # 2. Old User Information --> libsvm format --> standardized vector로 변환
  libsvm_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/dropout-net/travel-log/user_features_0based.txt"
  old_user_vectors = create_standardized_user_vectors(libsvm_dir)

  # 3. Input User와 유사한 Old User 20명 추출
  top_K_similar_user_index = get_top_K_similar_user(new_user_vector, old_user_vectors, 20)

  # 4. Similar Old User 기반 지역별 Top K개 Tour Spot 추출
  embedding_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/dropout-net/checkpoint/Embedded-latent-factor"
  filtered_df = get_top_K_travel_area(embedding_dir, top_K_similar_user_index, week) # index, rating(top_K_recommend_area_value)

  print(filtered_df)

  # 6. json 파일 저장
  filtered_df.to_json("/home/ubuntu/MJU-CapstoneDesign-Project/model/recommended-result/tour-spot-result.json", orient="records")

  print("[FINISH : get_recommend_result.py]")
