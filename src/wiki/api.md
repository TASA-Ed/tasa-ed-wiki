---
icon: plug
title: TASA-Ed PHP-API
description: TASA-Ed 工作室提供的 PHP-API
isOriginal: true
order: 6
---

::: important
近期我们更改了全部 API 对参数的判断模式，可能会导致一些参数错误，如果你遇到**请及时反馈**。
:::

::: important
近期我们更改了[随机数生成](#随机数生成) 的默认生成器，请注意。
:::

TASA-Ed 工作室提供的 PHP-API

## 返回格式

各 API 返回格式基本一致，若有特殊情况则会在 返回 中标明。

### 文本格式

- 直接返回结果。

- 错误时返回：

```text
Error:

<错误类型> ;

Data:

<错误描述> ;

Success:

false ;
```

### json 格式

- 成功时返回：

```json
{
  "data":"<结果>",
  "success":true
}
```

- 错误时返回：

```json
{
  "error":"<错误类型>",
  "data":"<错误描述>", 
  "success":false
}
```

### xml 格式

- 成功时返回：

```xml
<api>
    <data>结果</data>
    <success>1</success>
</api>
```

- 错误时返回：

```xml
<api>
    <error>错误类型</error>
    <data>错误描述</data>
    <success/>
</api>
```

## API 相关

### 可用性查询

查询当前可用性。

```http request :no-line-numbers :no-line-numbers
GET https://api.tasaed.top/
```

在使用之前，请先请求以确保API可用性。

#### 参数

<!-- @include: ../format.snippet.md -->

#### 返回

仅返回 `success` 。

## 时间相关

### 时间获取

获取时间。

```http request :no-line-numbers
GET https://api.tasaed.top/time/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`:
  - `1` 为中国时区。
  - `2` 为时间戳。
  - `3` 为格林威治时间。
  - `4` 为协调世界时。
  - `5` 为上海时间。
  - `6` 为纽约时间。
  - `7` 为新加坡时间。
  - `8` 为乌鲁木齐时间。
  - `9` 为毫秒时间戳。
  - `10` 为自主输入时区，[PHP 时区列表](https://www.php.net/manual/zh/timezones.php)。
- `timezone`: 为时区，只在 `type=10` 时有效。

#### 返回

`data` 在返回时间戳时为 `int` 类型。

#### 示例

- [时间获取 - 获取毫秒级别时间戳 *毫秒时间戳（type=9）*](https://api.tasaed.top/time/?type=9)
- [时间获取 - 获取时间戳 *时间戳（type=2）*](https://api.tasaed.top/time/?type=2)
- [时间获取 - 获取时间 *中国时区（type=1）*](https://api.tasaed.top/time/?type=1)
- [时间获取 - 罗马时间 *以JSON格式输出（format=json&type=10&timezone=Europe/Rome）*](https://api.tasaed.top/time/?format=json&type=10&timezone=Europe/Rome)

## 文本处理

### 哈希

哈希值计算。推荐使用此API。

```http request :no-line-numbers
GET https://api.tasaed.top/hash/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `content`: 内容。
- `type`: 可为：
  - `sha256`, `sha512`, `sha3-256`, `crc32`, `md5`, `sha1`, `xxh3`, `md2`, `md4`, `gost`, `crc32b`, `crc32c`, `ripemd160`, `whirlpool`, `gostcrypto`, `ripemd256`, `murmur3a`, `murmur3f`, `sha`, `sha3`, `md`, `xxh`, `ripemd`, `murmur3`。
- `binary`: 为 `1` 时输出 Base64 格式。

::: warning
需要注意的是，`binary` 为 `1` 时我们会将哈希的二进制格式转为 Base64 。
:::

#### 示例

- [哈希 - SHA3-256 *使用SHA3-256加密数据（type=sha3 or sha3-256）*](https://api.tasaed.top/hash/?content=123456&type=sha3)
- [哈希 - xxHash *使用xxHash加密数据（type=xxh or xxh3）*](https://api.tasaed.top/hash/?content=123456&type=xxh)

### Base64

Base64编码或解码。

```http request :no-line-numbers
GET https://api.tasaed.top/base/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `value`: 内容。
- `type`:
  - `0` 为编码。
  - `1` 为解码。

#### 示例

- [Base64 - Base64编码 *使用Base64编码*](https://api.tasaed.top/base/?type=0&value=123456)
- [Base64 - Base64解码 *使用Base64解码*](https://api.tasaed.top/base/?type=1&value=MTE0NTE0)

## 生成相关

### 随机数生成

生成一个随机数。

```http request :no-line-numbers
GET https://api.tasaed.top/rand/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `min`: 最小数。
- `max`: 最大数。
- `type`:
  - `0` 为使用梅森旋转（Mersenne Twister）随机数生成器。
  - `1` 为使用默认生成器。
  - 不指定或指定错误将默认使用加密安全、均匀分布的生成器。

#### 返回

成功时 `data` 返回 `int` 类型。

#### 示例

- [随机数生成 - 生成随机数 *加密安全、均匀分布的生成器*](https://api.tasaed.top/rand/?min=1&max=9)
- [随机数生成 - 生成随机数2 *默认生成器*](https://api.tasaed.top/rand/?type=2&min=1&max=9)

### 生成 ULID

生成通用唯一按字典排序的标识符（ULID）。

```http request :no-line-numbers
GET https://api.tasaed.top/ulid/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`:
  - `1` 为指定一个时间戳生成。
- `timestamp`: 时间戳，请填写UNIX**毫秒**级时间戳。

#### 示例

- [ULID获取 - 获取ULID *获取 1742581646176 的 ULID*](https://api.tasaed.top/ulid/?type=1&timestamp=1742581646176)

### RGB与16进制互转

RGB与16进制互转。

```http request :no-line-numbers
GET https://api.tasaed.top/color/h2r/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`: 为 `1` 时是16进制转RGB，为 `2` 是RGB转16进制。
- `hex`: 16进制颜色代码，**只在** `type` 为 `1` 时有效。
- `rgb`: RGB颜色代码，用英文逗号 `,` 分割，**只在** `type` 为 `2` 时有效。

#### 返回

`type` 为 `1` 时返回一个数组，为 `2` 时返回一个字符串。

#### 示例

- [RGB与16进制互转 - 16进制转RGB *FF0000 转 RGB*](https://api.tasaed.top/color/h2r/?type=1&hex=FF0000)
- [RGB与16进制互转 - RGB转16进制 *17,69,20 转 16进制*](https://api.tasaed.top/color/h2r/?type=2&rgb=17,69,20)

### 句子转拼音

将任意中文转为拼音。

```http request :no-line-numbers
GET https://api.tasaed.top/pinyin/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`: 为转拼音类型。
  - `1` : 普通句子转拼音。
  - `2` : 在转为拼音的同时保留所有非汉字字符。
  - `3` : 将首字作为姓氏转换。
  - `4` : 转换为用于链接的拼音字符串。
  - `5` : 转换为只保留首字符的字符串。
  - `6` : 转换为只保留首字符字符串的同时保留原字符串的英文单词。
  - `7` : 转换为姓名首字母的字符串。
- `content`: 内容。
- `join`: 为连接拼音的字符串，不填写则为空字符串，填写sp将会转为空格。
- `tonestyle`: 为拼音样式。
  - `symbol` : （默认）声调符号，例如 pīn yīn。
  - `none` : 不输出拼音，例如 pin yin。
  - `number` : 末尾数字模式的拼音，例如 pin1 yin1。

#### 示例

- [句子转拼音 - 姓名转换 *单某某转成拼音，连接符为-，样式为无声调*](https://api.tasaed.top/pinyin/?content=%E5%8D%95%E6%9F%90%E6%9F%90&type=3&join=-&tonestyle=none)
- [句子转拼音 - 普通句子转换 *你好，世界转成拼音，连接符为sp（空格），样式为有声调*](https://api.tasaed.top/pinyin/?content=%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%B8%96%E7%95%8C&type=1&join=sp)

### Steam ID

[Steam ID 64 与 Steam ID 3](https://developer.valvesoftware.com/wiki/Zh/SteamID) 互转。

```http request :no-line-numbers
GET https://api.tasaed.top/get/steamid/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`: 为转拼音类型。
  - `1` : Steam ID 64 转 Steam ID 3。
  - `2` : （默认）Steam ID 3 转 Steam ID 64。
- `id`: Steam ID。

#### 示例

- [Steam ID - Steam ID 3 转 Steam ID 64 *将 1 转 Steam ID 64*](https://api.tasaed.top/get/steamid/?id=1)

## 获取相关

### 获取 IP

获取您当前的IP。支持 IPv6。

```http request :no-line-numbers
GET https://api.tasaed.top/ip/
```

#### 参数

<!-- @include: ../format.snippet.md -->

#### 示例

- [获取IP - 获取IP *获取当前IP*](https://api.tasaed.top/ip)

### 获取 UA

获取浏览器当前的UA。

```http request :no-line-numbers
GET https://api.tasaed.top/ua/
```

#### 参数

<!-- @include: ../format.snippet.md -->

- `type`: 为 `1` 时输出不转义斜杠的UA，**只在**输出json格式时有效。

#### 示例

- [获取UA - 获取UA *获取浏览器当前UA*](https://api.tasaed.top/ua)

### 获取必应壁纸链接

获取今日的必应壁纸链接。

```http request :no-line-numbers
GET https://api.tasaed.top/get/bingtoday/
```

#### 参数

- `format`:
  - `jump`(默认):跳转到链接。
  - `text`:输出文本格式。
  - `json`:输出 json 格式。
  - `xml`:输出 xml 格式。
- `type`: 为壁纸分辨率。
  - `f` : 为 1920x1080。
  - `m` : 为 1080x1920。
  - `hd` : 为 1280x720。
  - `hdm` : 为 720x1280。
  - `uhd` : 为 3840x2160。
- `unescape`: 为 `1` 时输出不转义斜杠的UA，**只在**输出json格式时有效。

#### 返回

`jump` 格式时会返回一个 301 重定向。

#### 示例

- [获取必应壁纸链接 - 获取必应壁纸链接 *获取今日的必应壁纸链接（HD）*](https://api.tasaed.top/get/bingtoday/?type=hd&format=text)
- [获取必应壁纸链接 - 获取必应壁纸链接 *获取今日的必应壁纸链接 JSON 格式（4K）*](https://api.tasaed.top/get/bingtoday/?type=uhd&unescape=1&format=json)
- [获取必应壁纸链接 - 获取必应壁纸链接 *跳转今日的必应壁纸链接（FHD）*](https://api.tasaed.top/get/bingtoday/?type=f)

### 获取 MC 服务器信息

获取 Minecraft 服务器信息。仅支持 Java 1.7+。

```http request :no-line-numbers
GET https://api.tasaed.top/get/minecraftServer/
```

#### 参数

- `hostname`: 服务器 IP 或域名
- `port`: 服务器端口

#### 返回

成功时返回：

```json
{
  "players": "<在线人数>/<最大人数>",
  "text": "<服务器描述>",
  "version": "<服务器版本>",
  "protocol": 0,
  "list": null | ["<玩家名称>"],
  "success": true
}
```

错误时返回：

```json
{
  "data": "错误描述",
  "success": false
}
```

### 获取 SL 服务器信息

获取 SCP: Secret Laboratory 服务器信息。可能适用于其他支持 [A2S](https://developer.valvesoftware.com/wiki/Server_queries) 协议查询的游戏服务器。

```http request :no-line-numbers
GET https://api.tasaed.top/get/slServer/
```

::: caution
在中国，有相当一部分 SCP: Secret Laboratory 服务器屏蔽了海外 UDP 请求，因此你可能无法获取到任何信息，只会返回 `{"data":"Failed to read any data from socket","success":false}` 。
:::

#### 参数

- `hostname`: 服务器 IP 或域名
- `port`: 服务器端口

#### 返回

成功时返回：

```json
{
  "title": "<服务器标题>",
  "players": "<在线人数>/<最大人数>",
  "bots": 0,
  "version": "<服务器版本>",
  "port": 0,
  "protocol": 0,
  "success": true
}
```

错误时返回：

```json
{
  "data": "错误描述",
  "success": false
}
```

## 其他

无。
