
# Welcome to Zach's Coding Sample

I'm really happy that you decided to checkout my coding sample! This sample helps prospective companies evaluate my technical skills and work experience. 

The sample is a single page that I originally built for Baylor Scott and White. It includes four custom blocks and a homepage pattern. 

There are two options for testing: local (recommended), and remote.
# Remote environment
The remote site can be accessed at https://zachcodesample.wpenginepowered.com/

Your login is: `Username: 10up` `Password: 2025-10up-zach`

# Local environment
This repository is set up to be easily tested locally with `wp-env`. 

## Requirements

* [NVM](https://github.com/creationix/nvm/) - to install the correct [Node.js](https://nodejs.org/en/) version.
* [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - to install Javascript dependencies.
* [Docker](https://www.docker.com/) - there are instructions available for installing Docker on [Windows 10 Pro](https://docs.docker.com/docker-for-windows/install/), [all other versions of Windows](https://docs.docker.com/toolbox/toolbox_install_windows/), [macOS](https://docs.docker.com/docker-for-mac/install/), and [Linux](https://docs.docker.com/v17.12/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script).
* [PHP 8.0 or higher](https://www.php.net/) - there are instructions available for installing PHP on [macOS](https://www.php.net/manual/en/install.macosx.php), [Windows systems](https://www.php.net/manual/en/install.windows.php), and [Unix systems](https://www.php.net/manual/en/install.unix.php).
* [Composer](https://getcomposer.org/doc/00-intro.md) - for PHP autoloader & lint and analysis scripts.

## Installation

Since you need a WordPress environment to run the theme, the quickest way to get up and running is to use the bundled `wp-env` environment.

Clone this repository to your local computer, `cd` to this directory, and install the required version of Node along with NPM and Composer dependencies:

```sh
nvm install
npm install
composer install
```

Then, start the local environment:

```sh
npm run env start
```

Finally, run the build process in a watch mode:

```sh
npm start
```

Now, you can access the site with the `code-sample` FSE theme installed and activated:

[http://localhost:8888/wp-admin](http://localhost:8888/wp-admin) (Username: `admin`, Password: `password`)

In order to stop the Docker containers, run:

```sh
npm run env stop
```

If you want to clean up the database of your local WordPress instance, run:

```sh
npm run env clean all
```

### Test data insertion

You can run the CLI script included in this repository to fill your local WordPress database with some posts.

```sh
npm run cli:insert-posts
```

### How to view the sample?

Login to WordPress, and create a new page. You should be prompted with a Pattern selector:

<img width="400px" src="https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-9.31.12 PM.png" />

Choose the homepage pattern. Then, give the page a name, and publish it. That's all! If you've already inserted test data with the CLI, you should be able to view the page with no issues.

You should also have access to these new blocks:

<img width="400px" src="https://wp.zacharyrener.com/wp-content/uploads/2025/03/Screenshot-2025-03-18-at-9.21.51 PM.png" />

# Recommended files to review

 1. _card.scss
 2. _block-layout.scss
 3. _mixins.scss
 4. Card Block ( src/card )
 5. Post Layouts Block ( src/layouts )
 6. Slider Block ( src/slider )
 7. Icon Block ( src/zach-icon )
 8. Styles Setup ( src/styles )

---

