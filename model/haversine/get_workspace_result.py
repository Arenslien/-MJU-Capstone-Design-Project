# 라이브러리 임포트
from haversine import haversine
import pandas as pd
import argparse
import json

# NearbyOffice Method
def NearbyOffice(pick, place):
    
    result = pd.DataFrame()

    for a in range(len(pick)):
        place['거리_'+str(a)] = 0

    for i in range(len(pick)):
        goal = (float(pick['Y_COORD'][i]),float(pick['X_COORD'][i]))

        for j in range(len(place)):
            start = (float(place['Y'][j]),float(place['X'][j]))
            place['거리_' + str(i)][j] = haversine(start, goal)

        df3 = place.sort_values('거리_' + str(i))[:3]
        df3['출발지'] = pick['VISIT_AREA_NM'][i]
        result = pd.concat([result,df3])

    result = result.reset_index(drop=True)
    result = result[['출발지','stores','address_name','Y','X']]

    v = result['address_name'].values
    result['도'] = 0
    result['시/군'] = 0

    for i in range(len(v)):
        parts = v[i].split(' ')
        result['도'][i] = parts[0]
        result['시/군'][i] = parts[1]

    result.columns = ['관광지','업무공간','주소','위도','경도','도','시/군']

    return result

if __name__=="__main__":
    print("[START : get_workspace_result.py]")
    # Goal: 추천한 AREA INFORMATION 정보와 가까운 업무공간 추천

    # 0. parser 설정
    parser = argparse.ArgumentParser(
      description="Demo script to get workspace Result on Recommended Tour Spot", 
      formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--dropoutnet-result-dir', type=str, help='result.json directory as result of get_recommend_result.py')

    args = parser.parse_args()

    # 1. 업무 공간 파일 로드
    sharedoffice = pd.read_csv('D:\\Programming\\MJU-CapstoneDesign-Project\\model\\haversine\\Dataset\\area_info_df.csv')
    studycafe = pd.read_csv('D:\\Programming\\MJU-CapstoneDesign-Project\\model\\haversine\\Dataset\\place_studycafe.csv')
    area_info_df = pd.read_csv('D:\\Programming\\MJU-CapstoneDesign-Project\\model\\haversine\\Dataset\\area_info_df.csv')
    place = pd.concat([sharedoffice,studycafe])
    place = place.reset_index(drop=True)

    # 2. result.json 파일 로드
    result_json_dir = args.dropoutnet_result_dir
    print(result_json_dir)

    with open(result_json_dir, "r") as f:
        js = json.loads(f.read())
    top_K_area_info_df = pd.DataFrame(js)
    
    print(top_K_area_info_df)
    # 2. haversine 진행
    pick = area_info_df.sample(3)
    pick = pick.reset_index(drop=True)
    office = NearbyOffice(pick,place)


# pick [AREA_ID, VISIT_AREA_NM, X, Y]

print(office)

    # 3. 결과값 json 으로 저장

