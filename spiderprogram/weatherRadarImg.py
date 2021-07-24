"""
Created on Fri Apr 12 17:31:25 2019
@author: sunst&晴雨qy
@des：爬取图片，提供两种方法
"""
# re模块主要包含了正则表达式
import re
# urllib模块提供了读取Web页面数据的接口
import urllib.request
from urllib import request
import sys

# 定义一个getHtml()函数
# def getSuperHtmlCode(url):
#     print('start-getsuperhtml')
#     with request.urlopen(url) as f:
#         data = f.read()
#         print('Status:', f.status, f.reason)
#         for k, v in f.getheaders():
#             print('%s: %s' % (k, v))
#         print('Data:', data.decode('utf-8'))
#         return data

# 定义一个getHtml()函数
def getHtml(url):
    print('start-gethtml')
    page = urllib.request.urlopen(url)  # urllib.request.urlopen()方法用于打开一个URL地址
    html = page.read()  # read()方法用于读取URL上的数据
    return html
def getImg(html):
    print(html)
    print('start getImg')
    reg = re.findall('src=.+?\.png',html)
    print('一级筛选')
    print(reg)
    print('二级筛选')
    print(reg[1])
    # pic_url = re.findall('"src"="(.*?)",',reg[1],re.S)
    print('三级筛选')
    print(re.findall('src="(.*?)"',reg[1]))
    pic_url_raw = re.findall('src="(.*?)"',reg[1])
    print('转化为字符串')
    pic_url = ','.join(pic_url_raw)
    print(pic_url)
    with open('/data/zcnetwork/sites/sitediv/www/ZCMS/spiderprogram/lastUrl.txt','r+') as file:
        lines = file.readlines()
        urlLast = lines[0]
    if (urlLast==pic_url) :
        print('目标文件未改变，退出')
        sys.exit(0)
    else:
        print('目标文件改变，正在下载')
        with open('/data/zcnetwork/sites/sitediv/www/ZCMS/spiderprogram/lastUrl.txt','w+') as file:
            file.write(pic_url)
        urllib.request.urlretrieve(pic_url, '/data/zcnetwork/sites/sitediv/www/ZCMS/img/weather/radar.png')
html = getHtml("https://weather.cma.cn/web/channel-103.html")
html=html.decode('utf-8')#python3
getImg(html)