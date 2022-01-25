export default {
    //localStorage
    dispatchEventStroage() {
        const signSetItem = localStorage.setItem
        localStorage.setItem = function(key, val) {
            let setEvent = new Event('setItemEvent')
            setEvent.key = key
            setEvent.newValue = val
            window.dispatchEvent(setEvent)
            signSetItem.apply(this, arguments)
        }

    },
    //sessionStorage
    dispatchEventStroage_S() {
        const signSetItem = sessionStorage.setItem
        sessionStorage.setItem = function(key, val) {
            let setEvent = new Event('setItemEvent_s')
            setEvent.key = key
            setEvent.newValue = val
            window.dispatchEvent(setEvent)
            signSetItem.apply(this, arguments)
        }

    }
} 