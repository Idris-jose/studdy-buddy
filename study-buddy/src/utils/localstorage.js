export function setItem(key, value) {
    try{
     window.localStorage.setItem(key, JSON.stringify(value))
    }
    catch(error){
        throw new Error('Failed to set item in localStorage: ' + error.message);
    }
    }
    
    export function getItem(key){
    try{
        const item = window.localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (parseError) {
                console.log('Error parsing JSON from localStorage:', parseError);
                return undefined;
            }
        }
        return undefined;
    }
    catch(error){
        console.log(error)
    }
    
    }