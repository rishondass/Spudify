# Spudify
---
If Spotify was made by someone who had no idea how Spotify worked. If it wasn't obvious this application is an attempt at creating a Spotify clone, the *heavy inspiration* from Spotify's UI and/or the title of the application might have gave it away. The goal of the project was to learn a new front end framework ([next.js]("https://nextjs.org/")) , use [tailwindcss](https://tailwindcss.com/) to accurate replicate css, and explore new/old options for backend. I'm not typically accustomed to writing documentation, so I'm using this blog as a way to keep my code and my brain organized. This tech blog will focus on the technical aspects of this project, in addition to, what seems to be a never ending pit of, problems that I ran into and how I solved them (or just gave up and asked ChatGPT).
## Features 
--- 
- [x] Add your own songs
- [x] Music streaming
- [x] Like/Dislike songs
- [X] Music controls
- [ ] Add songs from youtube
- [ ] Create custom playlists(backend supports it already just need to implement frontend)
- [ ] Group listening sessions

## Research
---
Having recently learned [React](https://react.dev/) I wanted to explore more since react didn't offer much server side capabilities, mostly a robust routing system that is a native feature in many frameworks. After a quick google search there I found out that react was a **library** where nextjs was a **framework** that was built on top of react. To my knowledge the difference a library and a frame work is that a library provides **specific functionality**, i.e. NumPy. A framework, on the other hand, provides *everything* you need to create a complete application. Nextjs seemed like the perfect step up from learning react as it builds on react, allowing for cooler things like server-side-rendering and data caching. 

### How does Spotify work?

Well you just go to Spotify and hit play right? Kind of. Its simple yet not so simple. Well that's all I knew when I had the idea for this project. 

#### Problem #1:
I tried googling the solution but I didn't know the right question to ask. After reading blogs like [this]("https://www.lifewire.com/what-is-spotify-4685829"),  [this]("https://www.pocket-lint.com/what-is-spotify-and-how-does-it-work/"), and [this]("https://www.cnet.com/tech/services-and-software/spotify-connect-what-is-and-how-it-works/") I had an idea of *what Spotify did or could do* but not very much on how its built or any technical aspects. 
##### Solution: CHATGPT! (The beginning of a great friendship)
ChatGPT has been a key fact in my research. Its like google but you don't really need to know what you're looking for. As long as you're in the ballpark ChatGPT can guess what you're trying to ask. It has boosted my learning 10x faster. Long gone are the hassles of trying to find accurate and reliable data, although ChatGPT doesn't guarantee these things, its the next best thing. This is what it had to say:  

``` text
Overall, the process involves a combination of client-side technologies (HTML, CSS, JavaScript) for rendering the user interface and handling user interactions, and server-side technologies for managing user authentication, processing requests, and delivering audio data. The use of modern web technologies allows Spotify to provide a seamless and interactive music streaming experience directly within web browsers.
```

Curious, I went to Spotify's web player and looked at the html using developer mode. This allowed me to see the layers and the way the app was functioning. However, I still couldn't figure out how they were playing the audio. After asking ChatGPT again, it was revealed that they're using the [WEB Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to play sounds in the background. Essentially its a `<audio>` element that is rendered in the background through JavaScript. Using the API is a far more robust way to handle data, especially when it comes to customizing the way audio is reproduced. 

ChatGPT also stated that Spotify sends compressed data in a file type of Ogg Vorbis which is not natively supported in browsers. The WEB Audio API allows you to decode this file in order to play the music in a seamless fashion. There are many more details regarding the WEB Audio API that I will not be discussing as that's outside the scope of this project and would make this blog longer that it needs to be.

### Learning Nextjs

Great! Now I know how Spotify handles audio behind the scenes. Now its time to learn how to use Nextjs. I thought it would be fairly simple since Nextjs is built on Reactjs so all the skills should transfer right? Well, yes and no. There are a lot of changes that Next takes on to make Reactjs *easier* to work with in addition to adding features such as routing. My main source of learning Nextjs was their [docs](https://nextjs.org/docs). Anytime I got confused on a topic I would go to a youtube video in order to understand it better. I even watched a [7 hour video](https://www.youtube.com/watch?v=843nec-IvW0) to get the concepts of Next, but the video was too long to commit to. I needed a easier way and to support my confirmation bias I found this [article](https://www.sciencedaily.com/releases/2022/01/220111153637.htm) that states that watching a video at 2x speed has no negative effects. So I put the video in 2x and finished it in 3.5 hours. 

### Backend

The purpose of the project was to build a Spotify clone, mostly on the front end side. However, the backend is one of the most integral parts of a web application. If not for a secure and robust backend many website/web applications today wouldn't work. Although the purpose was not to build a backend, I needed options to quickly make something without having to build one from scratch. For this project I would need things like Authentication, Database, and REST API features for the backend.

The phrase "no need to reinvent the wheel" reminds me of this situation. On one hand, its good to know how the wheel functions and where its faults and failures lie and the only way to do this to *reinvent* it. By making it from scratch you have a better idea of how the designing, testing, and implementing process works. On the other hand, it doesn't make sense to keep rebuilding something that you already have a good foundation for unless there is a change in the foundation. 

I've already built many application backends from scratch, some of which are far more complex that this project would need. I researched options for [backend as a service](https://www.cloudflare.com/learning/serverless/glossary/backend-as-a-service-baas/) and found that [firebase](https://firebase.google.com/) was a good route to take, however, I didn't want to pay for the services. They do offer a free tier, but as the load increases there would be need for more computing power and would charge me for that usage. This wasn't a viable option at the time of writing this blog as I'm still unemployed. I do have a good home lab server that I use to run and automate several things. I mostly use it as a media storage server where I store my movies and tv shows and run some other applications such as home assistant to automate things in my house. 
#### Problem #2:
I wanted the features that were offered with firebase, but didn't want to pay for it.
##### Solution: [supabase](https://supabase.com/)(has a really cool color scheme)
Supabase is a open source firebase alternative that handles a lot of the backend requirements for this project. While its very comparable to firebase its doesn't offer many of firebase's advanced features like data analytics. However, this is not something I need at this point in the project (maybe in the future). Additionally, it also has the ability to be self hosted so I should be able to host it on my home lab server with no difficulty as it has docker support.

## Design
---

W.I.P



