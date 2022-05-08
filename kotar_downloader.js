//// File Name ////
const FILE_NAME = 'book';

const nPages = document.getElementsByClassName('BV_oImage').length;
console.log(`Copying ${nPages} pages...`)

if (document.getElementById('jsPDFScript')) copyPages();

var jsPDFScript = document.createElement('script');

jsPDFScript.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js');
jsPDFScript.setAttribute('id','jsPDFScript');

document.head.appendChild(jsPDFScript);

document.getElementById('jsPDFScript').addEventListener('load', () => { copyPages(); });

async function copyPages() {
    var doc = new jsPDF();
    var width = doc.internal.pageSize.width;
    var height = doc.internal.pageSize.height;

    for (var i = 0; i < nPages; i++) {
        if (document.getElementsByClassName('BV_oImage')[i].style.backgroundImage) {
            var url = document.getElementsByClassName('BV_oImage')[i].style.backgroundImage.replace('url("' ,'').replace('")' ,'').replace("'", '').replace('nStep=4', 'nStep=7');
                    
            await fetch(url)
            .then((res) => res.blob())
            .then((b) => {
                let reader = new FileReader();
                reader.onload = () => {             
                    var img = new Image();
                    img.onload = async () => {
                        doc.addImage(img, 'JPEG', 0, 0, width, height);
                        if (i != nPages) {
                            doc.addPage();
                            doc.setPage(i+1);
                        }
                    }
                    img.src = reader.result;
                };
                reader.readAsDataURL(b);
            });
        }
    }
    console.log(`Saving pages to pdf`)
    setTimeout(() => {
        doc.save(`${FILE_NAME}.pdf`);
    }, 1500);
}