import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "next-js-37f1d",
      clientEmail: "firebase-adminsdk-fbsvc@next-js-37f1d.iam.gserviceaccount.com",
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDH6QhgGECJZ7bm
/KeOptvyr4RxcnssGbBqIMD5QKjG9Tj1zOGUFbZ0wjw4EjUgAmEKFx5+uR79JGVh
0lLXf3cmPOTVS3dF1bckueC+qkHWTmSRRJlbd8BEqaJc00H/kc3ifceaM3EGuUPY
CR66Gskd8zt0CVGKf29cOe8TXjjgnRQQR059kvpkPwYGHY5htcVSrad200YRrTOg
NSOblwckqPrty8tHG+d4XgoCK2dW8/p21W1WQewXIIQV+txdY0d9yEIDQWGvggXW
jikwVBpwsSucoQsCqaf3Y5J2tizQotGnoI1OuocASAtdHhspPJpGeMcIbDyGjl+B
z0BAEqYHAgMBAAECggEAU0/+UhH5X2pOUvCLogtPEdJtB1yXEZd5KpmQ4q+8RwJu
pR2oCy+LVRiXwSRxaHAlYe+loVlkHUp8R+q/5Jh2HwT0tyGWyQ9anp8qlztcacRM
7C+jG/gJtHPfuwC9+hUZMSGLPGvg2FUAfbm7SQMduvIh3md9yJL4ZX6tcKxtVsnT
OLJd1BsVY/wyPG6N0S7Tyd6lGyfGy/b/t+yzntOPer8uECDI5fi2yCu6VvDZf9lj
W9TvGnoKVInPF/b1J+w/JMJX/ksG+ydBRjzr0wmQMFCTQmv8QDOqQ0yT+q61Le2d
2m70cIGR03xqqrKoPzPL3+sbQeR2fROJFiUXkPI++QKBgQDmsegyOuuvia/i/ak8
aIvAS597MPBdG5/uXsvklEl1+S+mEmjhgVw5f7xoo4vViE0olol8YOUlmZ4SxO7V
IoXVkanDSSDbRGC1h9LrmQYaxatdJj9tfFonOy5egpNJ6A4x0/X3wXb+aJ9RjWcp
lGsWUFQz2O/I86pFYxmJ3gKuzwKBgQDd1qse18dZHAO/uZPwC/NyFJ5kC1DLd3xI
WDnKUNGDOEylwdKtMnJD/xpz7+croo/moW8Tl67A3tP8imBeul3n8A0cRZU/xvW5
qi/FEZhhdSrrDgZVs8oEhRYy+yoNperCcNpy1tsWTpNXA6SGuJl0cUavsrq+2ke9
evFwnC+jSQKBgQDLEqyNGuTBPvi/Xf+Nl5H9khQvQyMzMtAT6wqcihQob1QMYoRE
jbT7QIA/tEexjiwtoGYiQME12gYWC5kZsSwSlgjUSRlNKuHeqlN25NtE0eBJPRP0
ctSBWE03EMZK9qUYI7ePgpQW203zYf//0BB8MfYNNdfOEwA92EBw5ieCbQKBgHki
/wBxnebX+GgaY2FCdWaHQdKppy3kClbK7ou+xBmehaRCCdQP5vugcwZ6K0bVlzS+
VJRjUMb7JtERkvxHUn4TxGT6zjwsXgRLnZhEOmyFebEvUGA+NANx1SRzqIwZXO9e
hrsM/kfZEnYChDYY2ZsPPCU3OOh8843Rc8QlVZIZAoGARM0VXGtmFv0sEycjtgqo
ke1b/RGJWISEz39jlfcbPFY4yUTocUKUI5xTllZttFs2+eg7AH4gP3lX1CcO4iJz
T7QF4HKW5dJtTj3acq/Y/8Q8UEAXEwuBp6XPCNTFlHbU3RKoLq+gBwAzAZUcYgMA
x46LslHAABNMPy/omUy53VE=
-----END PRIVATE KEY-----`,
    }),
  });
}

export const db = admin.firestore();
