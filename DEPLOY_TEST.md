# onto.romaapi.com 测试部署

## 目录

测试机建议部署到：

```bash
/root/palantir
```

## 首次部署

```bash
git clone git@github.com:lisaluoyf/palantir.git /root/palantir
cd /root/palantir
cp .env.example .env
bash scripts/deploy-test.sh
```

## 反代

在测试机现有 Caddyfile 中增加：

```caddy
onto.romaapi.com {
  reverse_proxy host.docker.internal:3015
  encode zstd gzip
}
```

以及：

```caddy
http://onto.romaapi.com {
  redir https://{host}{uri} permanent
}
```

重载：

```bash
cd /root/romaapi.com
docker compose up -d --build caddy
```

## 管理入口

默认入口：

```text
/ops-console-roma-onto-secret
```

首次访问需要同时带管理 key，访问成功后会写入 HttpOnly cookie：

```text
/ops-console-roma-onto-secret?key=your-ops-access-key
```

生产前务必改：

- `OPS_CONSOLE_SECRET`
- `OPS_CONSOLE_ACCESS_KEY`
