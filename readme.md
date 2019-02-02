npm i -g ionic
npm i -g cordova

ionic start {appname} sidemenu --type ionic1

Instalar a belezura do SDK Android (o Android Studio já faz esse processo)
Instalar a maravilha do Java SDK 

Configurar as variavéis de ambiente
ANDROID_HOME = C:\Users\leand\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk1.8.0_201
PATH (%ANDROID_HOME%\platform-tools, %ANDROID_HOME%\tools, C:\Program Files\Java\jdk1.8.0_201)

C:\Users\leand\AppData\Local\Android\Sdk\tools\bin\sdkmanager --licenses

adb kill-server
adb devices
ionic cordova run android

chrome://inspect/#devices


fix some build problems
- cordova clean
