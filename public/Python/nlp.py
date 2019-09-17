# -*- coding:utf-8 -*-
import sys
from snownlp import SnowNLP
import json


def nlp(data, file):
    sentences = []
    senti_score = []

    complished = 0

    for i in data:
        a1 = SnowNLP(i[0])
        a2 = a1.sentiments
        sentences.append(i[0])
        senti_score.append(a2)
        complished += 1
        pass

    file.write("[\n")

    for idx in range(0, len(senti_score)):
        file.write("{}".format(senti_score[idx]))
        if idx < len(senti_score) - 1:
            file.write(",\n")
            pass
        else:
            file.write("\n")
        pass

    file.write("]\n")

    return


if __name__ == '__main__':
    for year in range(2016, 2019):
        with open("../public/data/origin$" + sys.argv[1] + "@" + sys.argv[2] + ".json",
                  encoding='utf8', errors='ignore') as file:
            out = open("../public/data/snownlp$" + sys.argv[1] + "@" + sys.argv[2] + ".json", mode='w', encoding='utf8')
            f = file.read()
            if f.startswith(u'\ufeff'):
                f = f.encode('utf8')[3:].decode('utf8')
            data = json.loads(f)
            nlp(data, out)
            out.close()
            pass
        pass

