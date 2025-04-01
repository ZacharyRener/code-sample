
# Zach's Coding Sample

Thanks for checking out my coding sample. This sample is a single page that I originally built for Baylor Scott and White. It includes four custom blocks and a homepage pattern. 

There are two options for testing: local (recommended), and remote.

# Remote Testing
The remote site can be accessed at https://zachcodesample.wpenginepowered.com/

Your login is: Username: `code-sample` Password: `2025-code-sample`

Review the homepage. Feel free to edit.

# Local Testing
This repository is a theme that can be easily setup with `wp-env`. Make sure you have the basic requirements: NPM, NVM, Docker, PHP, and Composer.

## Local Setup Steps

Clone this repository, `cd` into it, and install the dependencies:

```sh
nvm install
```
```sh
npm install
```
```sh
composer install
```

Then, start the server:

```sh
npm run env start
```
Then, activate the theme:

```sh
npm run cli:activate-theme
```
Then, add the sample content (Homepage + Sample Posts)

```sh
npm run cli:insert-content
```

Then, build it:

```sh
npm run build
```

Now you can access the site with the `code-sample` FSE theme installed and activated:

[http://localhost:8888/](http://localhost:8888/) (The homepage should be setup) 

[http://localhost:8888/wp-admin](http://localhost:8888/wp-admin) (Username: `admin`, Password: `password`)

Other Helpful Commands:

Stop the server / docker instance:

```sh
npm run env stop
```

Reset the database to default WordPress (Removes home & sample posts):

```sh
npm run env clean all
```


## How to view the sample?

If you ran the CLI commands, the homepage should be setup and accessible locally:

[http://localhost:8888/](http://localhost:8888/) (Username: `admin`, Password: `password`)

And it should be identical to the remote site:

https://zachcodesample.wpenginepowered.com/ (Username: `code-sample`, Password: `2025-code-sample`)

Otherwise, Login to WordPress, ensure the "Zach FSE Theme" is active, and create a new page. You should be prompted with a Pattern selector:

<img width="400px" src="https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-9.31.12 PM.png" />

Choose the homepage pattern. Then, give the page a name, and publish it. That's all! 

This page displays recent posts throughout, so make sure to have a few dummy posts made with featured images. If you ran the CLI command you'll already have plenty.

You should also have access to these new blocks:

<img width="400px" src="https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-9.21.51 PM.png" />

Review the new page you've created, or the homepage if it was created for you. It should be the same as the homepage of the remote site.

# Recommended files to review

 1. _card.scss
 2. _block-layout.scss
 3. _mixins.scss
 4. Card Block ( src/card )
 5. Post Layouts Block ( src/layouts )
 6. Slider Block ( src/slider )
 7. Icon Block ( src/zach-icon )
 8. Styles Setup ( src/styles )


# What should I be seeing?

![enter image description here](https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-10.56.46%E2%80%AFPM.png)

![enter image description here](https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-10.59.42%E2%80%AFPM.png)

---

