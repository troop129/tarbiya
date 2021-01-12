const target = document.getElementById('target');
const download = document.getElementById('download');
const snackbar = document.getElementById('snackbar');
const generate = document.getElementById('generate');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');

generate.addEventListener('click', () => {
    // COLLECT FORM DATA
    const data = {
        name: name.value,
        phone: phone.value,
        email: email.value
    };

    if (!(data.name || data.value || data.email)) {
        // SHOW SNACKBAR FOR 3 SECONDS IF THERE IS MISSING DATA

        snackbar.classList.add('show');

        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 3000);
    } else {
        // BUILD QR CODE URL
        const urlObj = new URL('https://chart.googleapis.com/chart');

        urlObj.searchParams.append('cht', 'qr'); // CHART TYPE
        urlObj.searchParams.append('chs', '500x500'); // SIZE

        // DATA
        // JSON.stringify() CONVERTS DATA OBJECT INTO A STRING. MAKES IT EASIER TO PARSE LATER WITH JSON.parse()
        // encodeURIComponent() TRANSFORM ANY URL INVALID CHARACTER INTO AN UTF-8 URL-encoded CHARACTER (PER API DOCUMENTATION). USE decodeURIComponent() TO REVERT
        urlObj.searchParams.append(
            'chl',
            encodeURIComponent(JSON.stringify(data))
        );

        // ERROR CORRECTION LEVEL AND MARGIN
        urlObj.searchParams.append('chld', 'L|0');

        // CREATE A NEW AJAX REQUEST
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('loadend', (e) => {
            // CONVERT RECEIVED RESPONSE INTO A LOCAL BLOB OBJECT REPRESENTATION
            const blobUrl = URL.createObjectURL(e.target.response);

            // DISPLAY QR CODE
            target.src = blobUrl;

            // ALLOW QR CODE TO BE DOWNLOADED THROUGH A BUTTON
            download.href = blobUrl;
            download.download = name.value+'.png';
        });

        xhr.responseType = 'blob';
        xhr.open('GET', urlObj.toString());
        xhr.send();
    }
});
