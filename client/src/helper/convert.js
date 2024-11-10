/*image onto base64 format */

export default function convertToBase64(file){
    return new Promise((resolve,reject) => {
        const fileReader= new FileReader();
        fileReader.readAsDataURL(file);
    })
}