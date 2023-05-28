(async () => {
  const api = '/api/v1/'

  async function logout() {
      const userId = localStorage.getItem('userId')
      const headers = new Headers({'Content-Type': 'application/json'})
      const body = JSON.stringify({ userId })
      const res = await fetch('/logout', {
          method: 'DELETE',
          headers,
          body
      })
      if (res.ok) location.href = '/login'
    }
  
  async function addBookmark(id) {
    const headers = new Headers({'Content-Type': 'application/json'})
    const res = await fetch(api + '/bookmark', { method: 'POST', headers, body: JSON.stringify({ id })})
    if (res.ok) return res
    return refresh(addBookmark, id)
  }
  async function rmBookmark(id) {
    const headers = new Headers({'Content-Type': 'application/json'})
    const res = await fetch(api + '/bookmark', { method: 'DELETE', headers, body: JSON.stringify({ id })})
    if (res.ok) return res
    return refresh(rmBookmark, id)
  }

  function setContainer() {
      return document.querySelector('body').innerHTML = `<div class="container">
      <aside class="sidebar">
        <div class="logo">
          <a href="/"><img src="./assets/logo.svg" alt="logo"></a>
        </div>
        <nav class="navbar">
          <a href="/">
            <svg class="home" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 0H1C.4 0 0 .4 0 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11H1c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1ZM19 0h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1Zm0 11h-7c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1Z" fill="#5A698F"/></svg>
          </a>
          <a href="movies">
            <svg class="movies active" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z" fill="#5A698F"/></svg>
          </a>
          <a href="/tv">
            <svg class="tv__series" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z" fill="#5A698F"/></svg>
          </a>
          <a href="/bookmark">
            <svg class="bookmark__nav" viewBox="0 0 17 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.387 0c.202 0 .396.04.581.119.291.115.522.295.694.542.172.247.258.52.258.82v17.038c0 .3-.086.573-.258.82a1.49 1.49 0 0 1-.694.542 1.49 1.49 0 0 1-.581.106c-.423 0-.79-.141-1.098-.423L8.46 13.959l-5.83 5.605c-.317.29-.682.436-1.097.436-.202 0-.396-.04-.581-.119a1.49 1.49 0 0 1-.694-.542A1.402 1.402 0 0 1 0 18.52V1.481c0-.3.086-.573.258-.82A1.49 1.49 0 0 1 .952.119C1.137.039 1.33 0 1.533 0h13.854Z" fill="#5A698F"/></svg>
          </a>
        </nav>
        <div class="avatar">
          <img src="./assets/image-avatar.png" alt="avatar">
        </div>
        <div class="logout__container none">
          <div class="logout"><p>Logout</p></div>
        </div>
      </aside>
      <main>
        <form action="/movies" class="search">
          <img class="logo__search" src="./assets/icon-search.svg" alt="logo search">
          <label class="input__label">
            <input class="input__search fs-xl" type="text" name="q" id="search" placeholder="Search for movies or TV series" value="">
          </label>
        </form>
        <section class="intl__sect">
          <h3 class="fs-xxl">Movies</h3>
          <div class="cards__m"></div>
        </section>
      </main>
    </div>`
  }

  function setElements(movies) {
    const logoutBtn = document.querySelector('.logout__container')
    const avatar = document.querySelector('.avatar')

    avatar?.addEventListener('click', () => {
        logoutBtn.classList.toggle('none')
    })

    logoutBtn?.addEventListener('click', logout)

    function createElement(el, classname = '', value = '') {
        const newElement = document.createElement(el)
        if (classname) {
            newElement.setAttribute('class', classname)
        } 
        if (value) {
            newElement.textContent = value
        }
        return newElement
    }

    function getCategoryThumb(category) {
        if (category === 'Movie') {
            return './assets/icon-category-movie.svg'
        }
        return './assets/icon-category-tv.svg'
    }


    function bookmark(movie, section = 't') {
      const isBookmarked = movie.isBookmarked ? 'full' : 'empty'
      section = section === 'r' ? 'bookmark r' : 'bookmark'
      const div = createElement('div', `${section} ${!movie.isBookmarked ? 'empty' : ''}`)
      div.setAttribute('id', movie.id)

      const img = createElement('img')
      img.setAttribute('src', `./assets/icon-bookmark-${isBookmarked}.svg`)
      div.appendChild(img)
      return div
    }

    function overlayBg(section = 't') {
        section = section === 't' ? 'overlay__play__t' : 'overlay__play__r'
        const overlay__play = createElement('div', section)
        const center = createElement('div', 'center')
        const img = createElement('img')
        const play = createElement('p', 'fs-bold-l', 'Play')
        
        img.setAttribute('src', './assets/icon-play.svg')
        center.append(img, play)
        overlay__play.append(center)
        return overlay__play
    }

    function thumbnailR(movie) {
        const thumb__recommend = createElement('div', 'thumb__recommend')
        const thumb__wrapper = createElement('div', 'thumb__wrapper')
        const img = createElement('img')
        img.setAttribute('src', movie.thumbnail.regular.medium)

        thumb__wrapper.append(img)
        thumb__recommend.append(thumb__wrapper, overlayBg('r'), bookmark(movie, 'r'))
        return thumb__recommend
    }

    function movieInformtionR(movie) {
        const movie__details = createElement('div', 'movie__details__r')
        const top = createElement('div', 'top')
        const year = createElement('p', 'fs-s blend year', movie.year)
        const dot1 = createElement('span', 'dot')
        const dot2 = createElement('span', 'dot')
        const category = createElement('div', 'category')
        const imgCategory = createElement('img')

        imgCategory.setAttribute('src', getCategoryThumb(movie.category))
        imgCategory.setAttribute('alt', movie.title)

        const categoryMovie = createElement('p', 'fs-s blend category', movie.category)
        const rating = createElement('p', 'fs-s blend rating', movie.rating)
        const title = createElement('h3', 'fs-bold-l title', movie.title)

        category.append(imgCategory, categoryMovie)
        top.append(year, dot1, category, dot2, rating)
        movie__details.append(top, title)
        return movie__details
    }

    for (const movie of movies) {
        const cards__m = document.querySelector('.cards__m')
        const card__r = createElement('div', 'card__r')
        card__r.setAttribute('id', movie.id)
        card__r.append(thumbnailR(movie), movieInformtionR(movie))
        cards__m.append(card__r)
    }

    const bookmarks = document.querySelectorAll('.bookmark')

    bookmarks.forEach((bookmark) => {
      const id = bookmark.getAttribute('id')
      const img = bookmark.querySelector('img')

      bookmark.addEventListener('click', async () => {

        if (bookmark.classList.contains('empty')) {
          const res = await addBookmark(id)
          img.src = './assets/icon-bookmark-full.svg'
          if (res.ok) bookmark.classList.toggle('empty')
        } else {
          const res = await rmBookmark(id)
          img.src = './assets/icon-bookmark-empty.svg'
          if (res.ok) bookmark.classList.toggle('empty')
        }
      })
    })

    const inputSearch = document.querySelector('.input__search')
    const formSearch = document.querySelector('.search')
    
    formSearch.addEventListener('submit', async (e) => {
      e.preventDefault()
      const contents = document.querySelector('.search + section')
      const res = await searchAjax(inputSearch.value)
      
      if (res) {
        const movies = await res.json()
        onSuccessSearch(movies, inputSearch.value, contents)
      } else {
        const refresh = await fetch(api + 'refresh-token', { method: 'GET' })
        if (refresh.ok) {
          const res = await searchAjax(inputSearch.value)
          if (res.ok) {
            const movies = await res.json()
            onSuccessSearch(movies, inputSearch.value, contents)
          }
        }
      }
    })

    function onSuccessSearch(movies, value, parent) {
      const cards__r = document.createElement('div')
      cards__r.setAttribute('class', 'cards__r')
      const h1 = document.createElement('h1')
      h1.setAttribute('class', 'fs-xxl s__heading')
      h1.textContent = `Found ${movies.length} ${movies.length > 1 ? 'results' : 'result'} for '${value}'`
  
      movies.forEach((movie) => {
        const card__r = createElement('div', 'card__r')
          card__r.append(thumbnailR(movie), movieInformtionR(movie))
          cards__r.append(card__r)
      })
      const temp = document.createElement('section')
      temp.append(h1, cards__r)
      parent.replaceWith(temp)
    }
  }

  async function searchAjax(value) {
    const res = await fetch(api + 'search' + `?q=${encodeURI(value)}&type=movie`, { method: 'GET' })
    if (res.ok) return res
    return false
  }

  async function refresh(cb, param) {
    try {
        const res = await fetch(api + 'refresh-token', { method: 'GET' })
        if (res.ok) return cb(param)
        return window.location.href = '/login'
    } catch (error) {
        window.location.href = '/login'
    }
  }

  async function init() {
      try {
          const res = await fetch(api + 'movies')
          if (res.ok) {
              setContainer()
              return setElements(await res.json())
          }    
          return refresh(init)    
  
      } catch (error) {
          console.log()
      }
  }
  init()
})()