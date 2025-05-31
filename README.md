**Run App**
 
 back end:
 
•	cd ./backend

•	yarn dev

font end: 

•	cd ./frontend

•	yarn dev

•	Or you can test on: [http://skipli.ducdatphat.id.vn/]([url](http://skipli.ducdatphat.id.vn/))

•	Figma andworkflow: [https://www.figma.com/design/oylqtYAOVmhFWivXEEc1wr/Untitled?node-id=0-1&t=i6lxlyC5mfDSPmcv-1]([url](https://www.figma.com/design/oylqtYAOVmhFWivXEEc1wr/Untitled?node-id=0-1&t=i6lxlyC5mfDSPmcv-1))

Code Organization

**Back-end**:  Handles API logic, Stringee SMS/Voice, and Firebase integration.
•	app.js: Initializes Express server and routes.
•	src/services/stringee.service.js: Manages Stringee API calls.
•	src/services/gemini.service.js: Manages genrate content function.
•	src/controllers/auth.controller.js: Processes login and OTP logic.
•	src/controllers/content.controller.js: Processes content logic.
•	src/config/firebase.js: Configures Firebase Admin SDK.

 ![image](https://github.com/user-attachments/assets/d388c38a-616c-4f7f-8891-5186fe21301b)
 
**Frontend**: Provides user interface for login, caption creation, and sharing.
src/components: contain tabs, sidebar or other components.
src/page: include Dashboard and Login page.
vite.config.js: Configures Vite build and proxy.
nginx.conf: Serves static files on skipli.ducdatphat.id.vn.

![image](https://github.com/user-attachments/assets/7ccbb7ef-3bea-4dd7-9042-a3558058df4b)

**Usage**
1.	Login: Enter a phone number (e.g., +84869761465) to receive an OTP via SMS.
2.	Generate Captions: Choose a social network, topic (e.g., "Du lịch Đà Lạt"), and tone, then generate captions.
3.	Share Captions: Share via SMS or voice call using Stringee API.
4.	Save Captions: Store captions in Firebase Firestore for later use.
**Screenshots**
Below are screenshots showcasing the Skipli application:
Login Screen

![image](https://github.com/user-attachments/assets/e4c95d0b-0f7e-45e9-bbef-479e5d415e81)

Caption Generation

![image](https://github.com/user-attachments/assets/535c031a-11b0-4449-b0d2-58639f6ebfab)

Idea Generation
![image](https://github.com/user-attachments/assets/82aef66a-711c-4f37-9580-80016c68eade)

Profile Page

![image](https://github.com/user-attachments/assets/6dd60737-d4c5-462d-bc09-a614bf3f051e)

