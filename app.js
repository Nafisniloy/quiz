if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')

    .then(function(){
        console.log('Service Worker Registered');
    })
    .catch(function(){
        console.log('Service Worker Registration Failed');
    });
}

// how can i run service worker on localhost on chrome?
//  https://stackoverflow.com/questions/48463483/how-can-i-run-service-worker-on-localhost-on-chrome