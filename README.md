# bittiger-githubV3API
太阁暑期项目--6月
get_data.js: 从文哲的database中读取用户的Location，然后用Google api转换为经纬度，再加上3D地球上的柱子高度，向firebase中写入数据。
get_data_viceversa.js:同上，不加高度，纯2D经纬度；
tmp.js：同上，不加高度，加上此地的州名，数据库名为location_2D_state；
jquery-csv-master/examples/data中的node-usage.js：向firebase中导入csv数据，包括city name, id，count=0；
jquery-csv-master/examples/data中的tmp_get_staeinscv.js:向firebase中写入数据, id为主key,里面含city name, count（更新的），
state名字（"CA"）
