# How to Contribute

First of all, thank you for taking an interest in this project. This document is just a small guide on contributing to this project.

### Workflow and Pull Requests

_Before_ submitting a pull request, please make sure the following is done…

1.  Fork the repo and create your branch from `master`. A guide on how to fork a repository: https://help.github.com/articles/fork-a-repo/

    Open terminal (e.g. Terminal, iTerm, Git Bash or Git Shell) and type:

    ```sh-session
    $ git clone https://github.com/<your_username>/react-image-snipper
    $ cd react-image-snipper
    $ git checkout -b my_branch
    ```

    Note: Replace `<your_username>` with your GitHub username


1.  Run `npm install`. <br />

    ```sh
    npm install
    ```

    To check your version of Yarn and ensure it's installed you can type:

    ```sh
    npm --version
    ```

When a pull request is done, it goes through our continuous integration service which runs tests to verify that nothing has broken. After that, a maintainer will take a look at the pull request and give feedback on it. If all is well, it will be merged into master. 

#### Testing

Code that is written needs to be tested to ensure that it achieves the desired behaviour. Tests should live in the same directory as the file under test. That is, if you are testing a file named `Action.js`, an accompanying file named `Action.spec.js` should be co-located. This project uses `Jest` and as such, we recommend that you use the appropriate matchers provided by `Jest`.


## Bugs

### Where to Find Known Issues

We will be using GitHub Issues for our public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Please provide a public repository with a runnable example.