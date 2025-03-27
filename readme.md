
# Welcome to Zach's Coding Sample

Thanks for checking out my coding sample. This sample helps prospective companies evaluate my technical skills and work experience. 

The sample is a single page that I originally built for Baylor Scott and White. It includes four custom blocks and a homepage pattern. 

There are two options for testing: local (recommended), and remote.

# Remote Testing
The remote site can be accessed at https://zachcodesample.wpenginepowered.com/

Your login is: Username: `code-sample` Password: `2025-code-sample`

Review the homepage. Feel free to edit.

# Local Testing
This repository is set up to be easily tested locally with `wp-env`. 

## Requirements

* [NVM](https://github.com/creationix/nvm/)
* [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Docker](https://www.docker.com/)
* [PHP 8.0 or higher](https://www.php.net/)
* [Composer](https://getcomposer.org/doc/00-intro.md)

## Setup Steps

This repository is a theme. The easiest and recommended way to get setup it to use the included `wp-env` environment.

Clone this repository, `cd` to this directory, and install dependencies:

```sh
nvm install
```
```sh
npm install
```
```sh
composer install
```

Then, start the local environment:

```sh
npm run env start
```
Then activate the theme:

```sh
npm run cli:activate-theme
```
Then, run the CLI script to fill your local database with some test posts and the homepage:

```sh
npm run cli:insert-content
```

Then, run the build process in watch mode:

```sh
npm start
```

Now, you can access the site with the `code-sample` FSE theme installed and activated:

[http://localhost:8888/](http://localhost:8888/) (The homepage should be setup) 

[http://localhost:8888/wp-admin](http://localhost:8888/wp-admin) (Username: `admin`, Password: `password`)

If you want to stop the Docker containers:

```sh
npm run env stop
```

If you want to reset the database of your WordPress instance:

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

