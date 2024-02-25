##### Signature Route:

#### Create a new signature

```http
  POST http://localhost:5000/signature
```

demo data format:

```json
{
  "signatureList": [
    {
      "userId": "teacher12",
      "id": "65c9a9f31bb64869cf160980"
    }
  ],
  "studentSignature": {
    "userId": "john_doe",
    "id": "65cb33aa59d152450d90ea78"
  },
  "application": {
    "subject": "Request for Permission for Two-Day Demo Event",
    "body": "I hope this letter finds you well. My name is John Doe, and I am writing to seek permission for a two-day demonstration event that I am planning to organize in collaboration with ABC Innovations on March 15th and 16th.The purpose of this demonstration, titled  is to showcase our latest product, the QuantumX, an innovative solution designed to streamline business operations. This event is crucial for our company as it will provide an excellent opportunity to engage with potential clients, demonstrate the unique features of our product, and gather valuable feedback.I have attached a detailed proposal outlining the schedule, activities, and benefits of the demonstration event. Additionally, we have taken all necessary precautions to ensure that the event adheres to safety and health protocols.We understand the importance of obtaining proper permissions for events of this nature and assure you that we will adhere to all guidelines set forth by XYZ Corporation during the demonstration.I kindly request your approval for this event, and I am available at your convenience to discuss any details further. Your support in making this event a success is greatly appreciated.Thank you for considering our request, and I look forward to the opportunity to collaborate with XYZ Corporation."
  }
}
```

demo returned data:
**This is the token to use as QR code**

```json
{
  "success": true,
  "message": "Request For Signature created successfully",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkYjAxZTcxNTM4ZDA5OGE0NDI5ZmMiLCJpYXQiOjE3MDc5Nzg3ODIsImV4cCI6MTcwNzk3ODg4Mn0.lg4zBHYAOMcBX6bquxb1ZQ06AE0HGWB_AcEkuYIcAS4"
}
```

#### Verify a signature

```http
  POST http://localhost:5000/signature/verify
```

Demo data format:

```json
{
  "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWNkYjAxZTcxNTM4ZDA5OGE0NDI5ZmMiLCJpYXQiOjE3MDc5Nzg3ODIsImV4cCI6MTcwNzk3ODg4Mn0.lg4zBHYAOMcBX6bquxb1ZQ06AE0HGWB_AcEkuYIcAS4"
}
```

Demo Returned Data:

```json
{
  "success": true,
  "message": "Signature verified successfully",
  "data": {
    "application": {
      "subject": "Request for Permission for Two-Day Demo Event",
      "body": "I hope this letter finds you well. My name is John Doe, and I am writing to seek permission for a two-day demonstration event that I am planning to organize in collaboration with ABC Innovations on March 15th and 16th.The purpose of this demonstration, titled  is to showcase our latest product, the QuantumX, an innovative solution designed to streamline business operations. This event is crucial for our company as it will provide an excellent opportunity to engage with potential clients, demonstrate the unique features of our product, and gather valuable feedback.I have attached a detailed proposal outlining the schedule, activities, and benefits of the demonstration event. Additionally, we have taken all necessary precautions to ensure that the event adheres to safety and health protocols.We understand the importance of obtaining proper permissions for events of this nature and assure you that we will adhere to all guidelines set forth by XYZ Corporation during the demonstration.I kindly request your approval for this event, and I am available at your convenience to discuss any details further. Your support in making this event a success is greatly appreciated.Thank you for considering our request, and I look forward to the opportunity to collaborate with XYZ Corporation."
    },
    "_id": "65cdb01e71538d098a4429fc",
    "signatureList": [
      {
        "userId": "teacher12",
        "id": "65c9a9f31bb64869cf160980",
        "isApproved": "pending",
        "_id": "65cdb01e71538d098a4429fd",
        "createdAt": "2024-02-15T06:33:02.566Z"
      }
    ],
    "studentSignature": {
      "userId": "john_doe",
      "id": "65cb33aa59d152450d90ea78",
      "isApproved": "pending",
      "_id": "65cdb01e71538d098a4429fe",
      "createdAt": "2024-02-15T06:33:02.566Z"
    },
    "__v": 0
  }
}
```
