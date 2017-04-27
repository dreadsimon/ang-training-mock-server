const express = require('express');
const router = express.Router();
const url = require('url');

module.exports = (server) => {

	router.get('/courses', (req, res, next) => {
		let url_parts = url.parse(req.originalUrl, true),
			query = url_parts.query,
			page = query.page,
			step = parseInt(query.count) || 10,
			sort = query.sort,
			queryStr = query.q,
			courses = server.db.getState().courses,
			response = {
				courses: courses,
				step: 10,
				pages: Math.ceil((courses.length) / step),
				current: 0
			},
			from = 0,
			to = 0;
		if (!!page) {
			if (response.pages < step) {
				to = response.pages;
			}
			from = page * step;
			to = from + step;
			console.log(from, to, step);
			response.current = page;
			response.courses = courses.slice(from, to);
		}
		if (!!queryStr && courses.length) {
			response.courses = response.courses.filter((item) => {
				return item.name.toLowerCase().search(queryStr.toLowerCase()) > -1;
			});
		}
		res.json(response);
	});

	return router;
};
