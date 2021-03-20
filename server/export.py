# -*- coding: utf-8 -*-
import os
import time
import json
import sys, getopt

name = ''
dirname_self = ''

def exportExcel(name, orgin_list):
    # result = open(folder_name+'/'+name+'-'+str(len(orgin_list))+'.xls', 'w', errors='ignore')
    result = open(os.path.join(dirname_self, folder_name+name+'.xls'), 'w', errors='ignore')
    # result = open(folder_name+'/'+name+'-'+len(orgin_list)+'.xls', 'w', errors='ignore')
    print("           ", name, "...........", len(orgin_list))
    for m in range(len(orgin_list)):
        # print(str(orgin_list[m]))
        for n in range(len(orgin_list[m])):
            # print(str(orgin_list[m][n]))
            # 避免编码问题导致导出失败
            try:
                result.write(str(orgin_list[m][n]).replace("\r", ' ').replace("\n", ' ').decode('gbk'))
            except UnicodeEncodeError as e:
                print(e)
                print(name,orgin_list[m][0],orgin_list[m][n])
                # result.write(str(orgin_list[m][n]).encode('utf_8_sig'))
            result.write('\t')
        result.write('\n')
    result.close()

def readData():
    with open(os.path.join(dirname_self, 'data/data.json'), 'r', encoding='utf8') as lines:
    # with open(os.path.abspath('produceMS/data/data.json'), 'r', encoding='utf8') as lines:
        array=lines.readlines()
        array2=[]
        print("             ——————读取数据——————")
        for i in array:
            i=i.strip('\n')
            array2.append(i)
        all_datas = json.loads(array2[0])
        print("****************************************************************************")
        print("         ——————创建文件夹成功——————", "\n")
        os.system("mkdir "+folder_name)

    print("****************************************************************************")
    exportExcel(all_datas["name"], all_datas['data'])
    print("****************************************************************************")
    print("     表格导出完成，请在",folder_name,"文件夹中查看")


def main(argv):
   try:
      opts, args = getopt.getopt(argv,"hn:",["name="])
   except getopt.GetoptError:
      print('test.py -n <name>')
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print('test.py -n <name>')
         sys.exit()
      elif opt in ("-n", "--name"):
         name = arg
   print('name is :', name)
   if name == "":
       print('name is empty', name)
       sys.exit()
   else:
       print('name is==', name)
       readData()


# 根据日期生成文件夹名称
# folder_name = "export\\"+time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime())
folder_name = "export\\"
print("开始执行...")


if __name__ == "__main__":
   dirname_self = os.path.dirname(os.path.abspath(__file__))
    # print(os.path.abspath('./data/data.json'))
   print('argv is :', sys)
   main(sys.argv[1:])



