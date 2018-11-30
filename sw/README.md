# 实验Service Worker

前提：SW必须建立在https协议上

1. 利用openssl创建https证书

```shell
＃生成私钥key文件
openssl genrsa 1024 > ./private.pem

＃通过私钥文件生成CSR证书签名
openssl req -new -key ./private.pem -out ./csr.pem

＃通过私钥文件和CSR证书签名生成证书文件
openssl x509 -req -days 365 -in ./csr.pem -signkey ./private.pem -out ./file.crt

```

把生成出来的私钥（private.pem）和证书文件（file.crt）拷贝到此目录下

