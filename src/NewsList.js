/* eslint-disable no-console */
/* eslint-disable import/extensions */
import NewsArticle from './NewsArticle.js';
import env from '../.env.js';

export default class NewsList {
  constructor() {
    this.articles = [];
    this.idCount = 0;
  }

  createArticle(headline, url, imageUrl) {
    this.articles.push(new NewsArticle(headline, url, imageUrl, this.idCount));
    this.idCount += 1;
  }

  getView() {
    let view = '';
    this.articles.forEach((article) => {
      view += `<p id="${article.id}"><a href="#articles/${article.id}">${article.headline}</a></p>`;
    });
    return view;
  }

  fetchFromGuardianAndUpdateArticles() {
    const url = `https://content.guardianapis.com/search?tag=technology/technology&api-key=${env.GUARDIAN_KEY}&show-fields=thumbnail`;
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        data.response.results.forEach((result) => {
          this.createArticle(result.webTitle, result.webUrl, result.fields.thumbnail);
        });
      });
  }

  fetchSummariesFromAylienAndUpdateSentences() {
    this.articles.forEach((article) => {
      // try Makers proxy if normal one is rate-limited
      // const urlRequest = `http://hnryjmes-cors-anywhere.herokuapp.com/http://news-summary-api.herokuapp.com/aylien?apiRequestUrl=https://api.aylien.com/api/v1/summarize?url=${article.url}`;
      const urlRequest = `http://hnryjmes-cors-anywhere.herokuapp.com/https://api.aylien.com/api/v1/summarize?url=${article.url}`;
      const request = new Request(urlRequest, {
        headers: new Headers({
          'X-AYLIEN-TextAPI-Application-Key': env.AYLIEN_KEY,
          'X-AYLIEN-TextAPI-Application-ID': env.AYLIEN_ID,
        }),
      });
      fetch(request).then(response => response.json())
        .then((data) => {
          console.log(data);
          // eslint-disable-next-line no-param-reassign
          article.sentences = data.sentences;
        })
        .catch((err) => {
          console.log("Sorry, it looks like the API request didn't work.");
          console.log(err);
        });
    });
    // eslint-disable-next-line no-console
    console.log('fetch done ✅');
  }
}
