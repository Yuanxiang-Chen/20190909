# -*- coding:utf-8 -*-
import sys
from gensim import corpora, models
import jieba.posseg as jp
import numpy as np
import random
import json


random.seed(11091987)

np.set_printoptions(threshold=np.inf)

# 分词过滤条件'
flags = ('n', 'nr', 'ns', 'nt', 'eng', 'v', 'd')  # 词性
stopwords = (
    '进一步', '做', '加大', '加强', '加快', '进行', '本市', '改造', '提升', '问题', '没有', '与', '了', '还', '被', '后', '苏', '皖', '我的', '车主', '对方',
    '请', '现场', '有', '已', '是', '时间', "尤其", "以", "电话", "吗", "能", "就", "建议", "让", "不", "都", "要", "太", "应该", "希望", "到", "最",
    "也", "应", "很", "更", "又", "来", "去", "再", "时", "问题", '杭州', '杭州市', '部门')  # 停词


"""
    运行参数说明：
        * 1 - 导入数据年份
        * 2 - 导入数据对象: "sjw" / "sjyj"
        * 3 - 主题数
"""

if __name__ == '__main__':
    # 导入文本集
    f = open("../public/data/origin$" + sys.argv[1] + "@" + sys.argv[2] + ".json",
             encoding='utf8', errors='ignore')
    t = f.read()
    if t.startswith(u'\ufeff'):
        t = t.encode('utf8')[3:].decode('utf8')
    texts = json.loads(t)
    f.close()

    # 分词
    words_ls = []
    for text in texts:
        words = [w.word for w in jp.cut(text) if w.flag in flags and w.word not in stopwords]
        words_ls.append(words)

    # 构造词典
    dictionary = corpora.Dictionary(words_ls)
    # 基于词典，使【词】→【稀疏向量】，并将向量放入列表，形成【稀疏向量集】
    corpus = [dictionary.doc2bow(words) for words in words_ls]

    # lda模型，num_topics设置主题的个数
    lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=sys.argv[3],
                                   alpha=int(sys.argv[3])/50, eta=0.01, minimum_probability=0.001,
                                   iterations=200, passes=20)

    with open('../public/data/lda${}${}@{}.json'.format(sys.argv[3], sys.argv[1], sys.argv[2]),
              mode="w", encoding="utf-8") as output:
        # 打印所有主题，每个主题显示n个词
        x = 0
        output.write('{"topics": [\n')
        for topic in lda.print_topics(num_words=20):
            s = list(topic)
            output.write('{"topic":' + str(x) + ',"words":[')
            li = str(s[1]).split(" + ")
            flag = 0
            for d in li:
                box = d.split("*")
                _text = box[1]
                _value = box[0]
                flag += 1
                if flag != 20 and flag < len(li):
                    output.write('{"word":' + _text + ',"value":' + _value + '},')
                else:
                    output.write('{"word":' + _text + ',"value":' + _value + '}')
            x += 1
            output.write(']}')
            if x < int(sys.argv[3]):
                output.write(",\n")
                pass
            pass
        output.write("],\n")

        # 主题推断
        output.write('"distributions": [\n')
        for i in range(0, len(lda.get_document_topics(corpus))):
            topic = lda.get_document_topics(corpus)[i]
            output.write("[")
            amended = []
            _sum = 0
            for e in topic:
                _sum += e[1]
                pass
            if int(sys.argv[3]) <= len(topic):
                amended = [[x[0], x[1] / _sum] for x in topic]
                pass
            else:
                for stack in range(0, int(sys.argv[3])):
                    found = False
                    for datum in topic:
                        if int(datum[0]) == stack:
                            amended.append([datum[0], datum[1]])
                            found = True
                            break
                        pass
                    if not found:
                        amended.append([stack, (1 - _sum) / (int(sys.argv[3]) - len(topic))])
                        pass
            for idx in range(0, int(sys.argv[3])):
                output.write('{"stack":' + "{}".format(amended[idx][0]) + ',"value":{}'.format(amended[idx][1]) + '}')
                if idx != int(sys.argv[3]) - 1:
                    output.write(",")
                pass
            if i != len(lda.get_document_topics(corpus)) - 1:
                output.write("],\n")
            else:
                output.write("]\n")
            pass
        output.write("]}\n")
        pass
    print("\n\nExited successfully! ")
    print("\n>>> Output data in file\n\t"
          + '../public/data/lda${}${}@{}.json'.format(sys.argv[3], sys.argv[1], sys.argv[2]))
    pass
