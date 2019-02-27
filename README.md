# Running server

1. Make sure you have constants.json file in /server -- file can be found on our google drive
2. `cd server && pip install -r requirements.txt`
3. `python server.py`

# Current state 2/22

Everything working before +

1. Highlighted category selecting(Sorta broken)
2. Login/signup w/ Cognito Python API
   - Login w/ existing user and is persistent
   - User data verified through jwt
   - Signup w/out confirm(manual)
     - Auto generates a user in db
3. React Router for... routes
4. Newscards updated w/ buttons(currently no function)
5. Additional nice stuff( Settings component, ML tab )

# Todos of prior to demo

- [ ] ML prepared
- [ ] ML API ready for client
- [x] Bookmarks per user and returning list of articles
- [x] UI for Settings
- [ ] Test for deployment
- [ ] Ahem, deploy it
- [ ] Actual error checking and finding bugs
