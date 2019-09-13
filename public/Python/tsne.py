# -*- coding:utf-8 -*-
import sys
import numpy as np
from sklearn.manifold import TSNE
import json


np.set_printoptions(threshold=np.inf)

if __name__ == '__main__':
    with open('../public/data/lda${}${}@{}.json'.format(sys.argv[3], sys.argv[1], sys.argv[2]),
              mode="r", encoding="utf-8") as file:
        text = json.load(file)
        box = []
        for doc in text["distributions"]:
            each = [x["value"] for x in doc]
            box.append(each)
            pass

        X = np.array(box)
        ts = TSNE(n_components=2, n_iter=2000)

        ts.fit_transform(X)

        with open('../public/data/tsne${}${}@{}.json'.format(sys.argv[3], sys.argv[1], sys.argv[2]),
                mode="w", encoding="utf-8") as output:
            output.write('[\n')
            for i in range(0, len(ts.embedding_)):
                if i != len(ts.embedding_) - 1:
                    output.write('[' + str(ts.embedding_[i][0]) + ',' + str(ts.embedding_[i][1]) + '],\n')
                else:
                    output.write('[' + str(ts.embedding_[i][0]) + ',' + str(ts.embedding_[i][1]) + ']\n')
                pass
            output.write(']\n')
            pass
        pass
    print("\n\nExited successfully! ")
    print("\n>>> Output data in file\n\t"
          + '../public/data/tsne${}${}@{}.json'.format(sys.argv[3], sys.argv[1], sys.argv[2]))
    pass

