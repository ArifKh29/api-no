## WA-API For OTP Webhook

EndPoint
```ts
[POST / GET] /api/send-message
```

Send Text Message
```json
{
    "apikey" : "yourapikey",
    "receiver" : "628xxxxx", // or id group
    "mtype" : "text"
    "text" : "your message",
}
```

Send Image Message
```json
{
    "apikey" : "yourapikey",
    "receiver" : "628xxxxx", // or id group
    "mtype" : "image",
    "text" : "your message",
    "url" : "https://yourimage.com/image.jpg"
}
```

Send Video Message
```json
{
    "apikey" : "yourapikey",
    "receiver" : "628xxxxx", // or id group
    "mtype" : "video",
    "text" : "your message",
    "url" : "https://yourvideo.com/video.mp4"
}
```

Send Audio Message
```json
{
    "apikey" : "yourapikey",
    "receiver" : "628xxxxx", // or id group
    "mtype" : "audio",
    "text" : "your message",
    "url" : "https://youraudio.com/audio.mp3"
}
```

Send Document Message
```json
{
    "apikey" : "yourapikey",
    "receiver" : "628xxxxx", // or id group
    "mtype" : "document",
    "text" : "your message",
    "url" : "https://yourdocument.com/document.pdf",
    "filename" : "document.pdf" // optional
}
```

Webhook (php)
```php
<?php
header('content-type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
// file_put_contents('logwebhook.txt', '[' . date('Y-m-d H:i:s') . "]\n" . json_encode($data) . "\n\n", FILE_APPEND);
$session = $data['session'] ?? null;
$from = $data['from'] ?? null;
$sender = $data['sender'] ?? null;
$body = $data['body'] ?? null;
$isGroup = $data['isGroup'] ?? null;
$messageType = $data['messageType'] ?? null;
$message = $data['message'] ?? null;

switch ($body) {
    case "ping":
        $data = [
            'to' => $from,
            'messageType' => 'text',
            'text' => 'pong'
        ];
        break;
    case "image":
        $data = [
            'to' => $from,
            'messageType' => 'image',
            'text' => 'This is image',
            'url' => 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
        ];
        break;
    case "video":
        $data = [
            'to' => $from,
            'messageType' => 'video',
            'text' => 'This is image',
            'url' => 'https://www.w3schools.com/html/mov_bbb.mp4'
        ];
        break;
    case "document":
        $data = [
            'to' => $from,
            'messageType' => 'document',
            'text' => 'This is image',
            'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            'filename' => 'test.pdf' // optional
        ];
        break;
    default:
        $data = false;
        break;
}

print json_encode([
    'status' => 'success',
    'data' => json_encode($data)
]);
```

