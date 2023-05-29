window.addEventListener('load', async () => {
    const email = document.querySelector('#email')
    const password = document.querySelector('#password')
    const confirmationPwd = document.querySelector('#repeat-password')

    const error = document.querySelector('.error__container')
    const inputs = document.querySelectorAll('input')
    const alertTxt = document.querySelectorAll('.alert')
    const bookmarks = document.querySelectorAll('.bookmark')

    const signupPage = document.querySelector('.signup')
    const loginPage = document.querySelector('.login')


    function emailValiadaton() {
        if (!email.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            return 'Please fill a valid Email address'
        }
        return false
    }
    function pwdValidation() {
        if (!password.value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/)) {
            return 'Enter a password combination of at least eight numbers, letters and punctuation marks (such as ! and &).'
        }
        return false
    }

    function inputEmptyCheckerOnBlur() {
        inputs.forEach((el, index) => {
            el.addEventListener('blur', () => {
                if (el.value === '') {
                    alertTxt[index].classList.remove('none')
                    el.classList.add('danger__border')
                } else {
                    alertTxt[index].classList.add('none')
                    el.classList.remove('danger__border')
                }
            })
        })
    }

    function inputEmptyChecker() {
        const check = []
        inputs.forEach((el, index) => {
            if (el.value === '') {
                alertTxt[index].classList.remove('none')
                el.classList.add('danger__border')
                check.push(false)
            }
            el.addEventListener('focus', () => {
                alertTxt[index].classList.add('none')
                el.classList.remove('danger__border')
            })
        })
        return check.every((value) => value === true)
    }

    function displayError(msg) {
        const div = document.createElement('div')
        div.classList.add('error__msg')

        const p = document.createElement('p')
        p.setAttribute('class', 'fs-m error__txt')
        p.textContent = msg

        div.append(p)
        error.append(div)
        
        setTimeout(() => {
            div.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            div.style.opacity = 0;
            div.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                div.remove();
            }, 300);
        }, 4000);
    }

    async function signup(e) {
        try {
            e.preventDefault()

            const errors = []

            if (password.value !== confirmationPwd.value) errors.push('Passwords doesn\'t match')
            if (emailValiadaton()) errors.push(emailValiadaton())
            if (pwdValidation()) errors.push(pwdValidation())

            inputEmptyChecker()

            if (errors.length > 0) {
                errors.forEach((msg) => {
                    displayError(msg)
                })
                return
            }

            const body = JSON.stringify({ email: email.value, password: password.value, repeat_password: confirmationPwd.value })
            const headers = new Headers({ 'Content-Type': 'application/json'})

            const res = await fetch('/signup', {
                method: 'POST',
                body,
                headers
            })

            const parsed = await res.json()
            if (res.ok) {
                console.log(parsed.userId)

                localStorage.setItem('userId', parsed.userId)
                window.location.href = '/login'
            } else {
                displayError(parsed.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function login (e) {
        try {
            e.preventDefault()

            const isEmpty = inputEmptyChecker()
            if(!isEmpty) return

            const body = JSON.stringify({ email: email.value, password: password.value })
            const headers = new Headers({ 'Content-Type': 'application/json'})

            const res = await fetch('/login', {
                method: 'POST',
                body,
                headers
            })

            const parsed = await res.json()
            if (res.ok) {
                console.log(parsed.userId)

                localStorage.setItem('userId', parsed.userId)
                window.location.href = '/'
            } else {
                displayError(parsed.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    bookmarks.forEach((bookmark) => {
        const img = bookmark.querySelector('img')
        const id = bookmark.getAttribute('id')
        bookmark.addEventListener('click', async () => {
            console.log('bookmark')
            const res = await fetch('/bookmark', {
                method: 'POST',
                headers: 'application/json',
                body: JSON.stringify({ movieId: id})
            })

            if (res.ok) {
                bookmark.classList.toggle('empty')
                if (!bookmark.classList.contains('empty')) {
                    img.src = './assets/icon-bookmark-full.svg'
                    return
                } else {
                    img.src = './assets/icon-bookmark-empty.svg'
                    return
                }
            }
            return console.log('Add bookmark faliled')
        })
        

    })


    if (loginPage) {
        document.querySelector('.form').addEventListener('submit', login)
        inputEmptyCheckerOnBlur()
    }

    if (signupPage) {
        document.querySelector('.form').addEventListener('submit', signup)
        inputEmptyCheckerOnBlur()
    }
})