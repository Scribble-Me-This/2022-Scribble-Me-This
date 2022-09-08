[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Scribble-Me-This">
    <img src="public/assets/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Scribble Me This</h1>

  <p align="center">
    A Pictionary-style game where players draw pictures from a prompt, and the 'scribble' with the highest AI confidence rating wins.
    <br />
    <a href="https://github.com/Scribble-Me-This/2022-Scribble-Me-This/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Scribble-Me-This/2022-Scribble-Me-This/wiki/Training-the-Machine-Learning-Model">Machine Learning</a>
    ·
    <a href="https://github.com/Scribble-Me-This/2022-Scribble-Me-This/wiki/Game-Logic">Game Logic</a>
    ·
    <a href="https://github.com/Scribble-Me-This/2022-Scribble-Me-This/wiki/Future-Additions">Future Content</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![product-screenshot-big][product-screenshot-big]](https://example.com)

Try Scribble Me This, our fun party game where you rage against the machine in a frantic race to see who's the best artist...
in the eyes of the AI!

Our web application is built with JavaScript and React in which players compete to have their drawing recognized by an AI before the other players. 
Scribble Me This uses a Convolutional Neural Network built with TensorFlow and ML5 machine learning frameworks and trained using Google's QuickDraw database. 
Individual players host and connect to lobbies over TCP using WebSocket based Socket.IO networks.

Features:
* Draw together with friends!
* Live updating status of your drawing's confidence rating!
* See what your friends are attempting to draw in real time!

Of course, our work is never done and we hope to add and expand features as we go!

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React.js][React.js]][React-url]
* [![Javascript][Javascript]][Javascript-url]
* [![Node.js][Node.js]][Node.js-url]
* [![Tensorflow][Tensorflow]][Tensorflow-url]
* [![Socket.io][Socket.io]][Socket.io-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Getting started is easy! Just follow the steps below to get a local copy up and running.

### Prerequisites

* npm
  ```sh
  npm install 
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/Scribble-Me-This/2022-Scribble-Me-This.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the server
   ```js
   npm run start
   ```
4. Open the app in your browser
   ```sh
    http://localhost:8080/
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Here's how to play the game:

_For more examples, please refer to the [Documentation](https://github.com/Scribble-Me-This/2022-Scribble-Me-This/wiki)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Make the machine learning model
- [x] Make the game logic
- [x] Have fun with friends
- [ ] Add multi-lobby support
- [ ] Fix all the bugs!
    - [ ] Server bugs when player refreshes while in game

See the [open issues](https://github.com/Scribble-Me-This/2022-Scribble-Me-This/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [Find us Here!](https://linktr.ee/scribblemethis) - Our LinkTree

Project Link: [https://github.com/Scribble-Me-This/2022-Scribble-Me-This](https://github.com/Scribble-Me-This/2022-Scribble-Me-This)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://linktr.ee/scribblemethis
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/Scribble-Me-This/2022-Scribble-Me-This/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/Scribble-Me-This/2022-Scribble-Me-This/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linktr.ee/scribblemethis
[product-screenshot]: public/assets/logo.svg
[product-screenshot-big]: public/assets/scribblemethis.PNG
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: https://nodejs.org/en/
[Tensorflow]: https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white
[Tensorflow-url]: https://www.tensorflow.org/
[Javascript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[Javascript-url]: https://www.javascript.com/
[Socket.io-url]: https://socket.io/
[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
