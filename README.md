# Music-Library-Node.js-Express-Backend
A music library website backend built with Node.js Express which allows users to upload music, create playlist and play music.

## Demo:
https://v-sing.com/

## Tips of installation
* [MongoDB](https://www.mongodb.com/) should be set up in advance. This application will automatically create a database named `vsing` and use it.
* You have to edit the `recap_site_key`, `recap_secret_key` and `site_url` variables in `lib/global.js`. You can get your reCAPTCHA keys on https://www.google.com/recaptcha/admin. The format of `site_url` should be `https://YOUR_SITE_DOMAIN`.
* You have to edit the secret and cookie domain of the `sessionMiddleware` in `app.js`. The secret is a random string. And the cookie domain is your site domain.
* You should build the frontend React app: https://github.com/roy-johnny/Music-Library-React-Frontend Read https://create-react-app.dev/docs/deployment/ to learn how to build. After building, you should add all files under build folder to public folder of this backend application.
* To active the music upload function, you should set `{upload: true}` to your account in database. Connect to your mongodb, enter `use vsing`, then execute `db.user.updateOne({name: YOUR_ACCOUNT_NAME}, {$set: {upload: true}})` to active the upload function of your account.
* To set the thumbnail of the song, you should manually add the 16:9 version of the thumbnail to `public/thumbnail` folder and the 1:1 version of the thumbnail to `public/disk`. Then when you upload a song, you only need to enter the file name of the thumbnail in the Thumbnail input box.