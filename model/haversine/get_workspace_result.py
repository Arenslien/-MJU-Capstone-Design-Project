# 라이브러리 임포트
from haversine import haversine
import pandas as pd
import argparse
import json


def get_workspace_result(tour_spot_df, work_space_df, week):
    # 0. 변수 초기화 & 준비
    column_name = ["WORK_SPACE_ID", "NAME", "VISIT_AREA_NM", "DISTANCE", "ADDRESS", "X_COORD", "Y_COORD", "AREA_GROUP"]
    all_result = pd.DataFrame(columns=column_name)
    area_group_list = tour_spot_df["AREA_GROUP"].unique().tolist()
    k = week-1 if week > 1 else week+1
    group_workspace_dict = {}
    
    # 2. 각 관광지별 작업공간 추천 - 추천 공간 개수는 5개 --> 
    for group_name in area_group_list:
        # 2.1 지역 그룹별 row 선택
        grouped_tour_spot_df = tour_spot_df[tour_spot_df["AREA_GROUP"] == group_name]
        grouped_tour_spot_df.reset_index(drop=True, inplace=True)
        grouped_work_space_df = work_space_df[work_space_df["AREA_GROUP"] == group_name]
        
        # 2.2 관광지와 모든 업무공간 사이의 위치 거리 구하기(haversine)
        group_workspace_list = []
        for tour_spot_idx, tour_spot_row in grouped_tour_spot_df.iterrows():
            if tour_spot_idx >= 5: continue
            tour_workspace_list = []
            for _, work_space_row in grouped_work_space_df.iterrows():
                tour_spot_coordinate = (float(tour_spot_row["Y_COORD"]), float(tour_spot_row["X_COORD"]))
                work_space_coordinate = (float(work_space_row["Y_COORD"]), float(work_space_row["X_COORD"]))

                distance = haversine(work_space_coordinate, tour_spot_coordinate, unit = 'km')

                new_row = {
                    "WORK_SPACE_ID": work_space_row["WORK_SPACE_ID"],
                    "NAME": work_space_row["NAME"],
                    "VISIT_AREA_NM": tour_spot_row["VISIT_AREA_NM"],
                    "DISTANCE": distance,
                    "ADDRESS": work_space_row["ADDRESS"],
                    "X_COORD": work_space_row["X_COORD"],
                    "Y_COORD": work_space_row["Y_COORD"],
                    "AREA_GROUP": group_name
                }
                tour_workspace_list.append(new_row)

            sorted_list = sorted(tour_workspace_list, key=(lambda x: x["DISTANCE"]))
            for row in sorted_list[:k]:
                group_workspace_list.append(row)
            
        # 각 그룹별 workspace group_workspace_dict에 추가
        if len(group_workspace_list) == 6: group_workspace_list.pop()
        group_workspace_dict[group_name] = group_workspace_list
    
    # 3. 결과값 출력
    for group_name in area_group_list:
        print(f"[{group_name}] - 추천된 업무공간 {len(group_workspace_dict[group_name])}개\n")
        for work_space_info in group_workspace_dict[group_name]:
            print(f"업무공간 이름: {work_space_info['NAME']}, 거리: {round(work_space_info['DISTANCE'], 3)} km, 기준: {work_space_info['VISIT_AREA_NM']}")
        print()

    # 4. 결과값 json으로 저장
    output_dir = "/home/ubuntu/MJU-CapstoneDesign-Project/model/recommended-result/"
    with open(output_dir + "work-space-result.json", "w") as json_file:
        json.dump(group_workspace_dict, json_file)

if __name__=="__main__":
    print("[START : get_workspace_result.py]")
    # Goal: 추천한 AREA INFORMATION 정보와 가까운 업무공간 추천

    # 0. parser 설정
    parser = argparse.ArgumentParser(
      description="Demo script to get workspace Result on Recommended Tour Spot", 
      formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--tour-spot-result-dir', type=str, help='result.json directory as result of get_recommend_result.py')
    parser.add_argument('--period', type=int, required=True, help="Workation Period")
    args = parser.parse_args()

    week = 4 if ((args.period - 1) // 7 + 1) > 4 else ((args.period - 1) // 7 + 1)

    # 1. 업무 공간 파일 로드
    work_space_df = pd.read_csv('/home/ubuntu/MJU-CapstoneDesign-Project/model/haversine/Dataset/workspace-all.csv', header=0)

    # 2. result.json 파일 로드
    result_json_dir = args.tour_spot_result_dir
    with open(result_json_dir, "r") as f:
        js = json.loads(f.read())
    tour_spot_df = pd.DataFrame(js)

    # 3. 업무공간 추천
    get_workspace_result(tour_spot_df, work_space_df, week)

    print("[FINISH : get_workspace_result.py]")

