const fs = require('fs')
const matter = require('gray-matter')
const parser = require('@deskeen/markdown')
const utf8 = require('utf8');


const dirs = ["stubs"]
let stubs = ''

function getNewID() {
  return 'dtrm-xxxxxxxxxxxxxxxx-'
    .replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16)
  }) + Date.now()
}

function processWikiLinks(text) {
  return text.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
    const id = linkText.trim().toLowerCase().replace(/\s+/g, '-')
    return `<a href="#${id}" class="wiki-link">${linkText}</a>`
  })
}



while(dirs.length > 0){


	const dir = dirs.shift()
	fs.readdir(dir, async (err, files) => {
		if (err) {
			throw err
		}
		files.forEach(async file => {
			if(file.slice(-2) !== 'md') return

			const yaml = matter.read(`${__dirname}/${dir}/${file}`);
			const data = yaml.data
			const html_code = parser.parse(utf8.encode(yaml.content)).innerHTML;
			const html_with_links = processWikiLinks(html_code)
			
			if(!data.id){
				data.id = getNewID()
			}
			
			if(!data.title){
				data.title = data.id
			}


			// Set coordinates from frontmatter or default to LA area
			if (!data.latitude || !data.longitude) {
				data.latitude = 34.05 + (Math.random() - 0.5)
				data.longitude = -118.25 + (Math.random() - 0.5)
			}
			data.zoom = data.zoom || Math.random() * 20
			data.bearing = data.bearing || Math.random() * 360
			data.pitch = data.pitch || Math.random() * 360 
		
			// Determine icon type from metadata
			const type = data.type || (data.labels && data.labels[0]) || 'default'

			const pullQuoteHTML = data.pullQuote ? `<div class="pull-quote">${data.pullQuote}</div>` : ''
			
			stubs += `
      <map-location
        latitude=${data.latitude}
        longitude=${data.longitude}
        zoom=${data.zoom}
        bearing=${data.bearing}
        pitch=${data.pitch}
        id=${data.id}
        data-type="${type}"
      >
        <map-marker type="${type}"></map-marker>
        ${pullQuoteHTML}
        <h1><map-marker type="${type}"></map-marker>${data.title}</h1>
        <article class="content">
          ${html_with_links}
        </article>

      </map-location>
			`


		})//end files

		console.log(stubs)

		fs.writeFile(`${__dirname}/stubs.html`, stubs, function(err){
			if(err){
				console.log(err)
			}
		})

	}) // end fs.readdir


}


