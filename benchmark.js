const Benchmark = require("benchmark");
const got = require("got");

/* Express */

const app = require("express")();

app.get("/", (req, res) => {
	res.end("Hello, World!");
});

app.listen(8001);

/* Hapi */

const server = new (require("hapi")).Server();

server.connection({
	host: "localhost",
	port: 8002
});

server.route({
	method: "GET",
	path: "/",
	handler(request, reply) {
		return reply("Hello, World!");
	}
});

server.start();

const suite = new Benchmark.Suite();

suite
.add("Hapi", {
	defer: true,
	fn(deferred) {
		got("http://localhost:8002")
		.then(() => {
			deferred.resolve();
		});
	}
})
.add("Express", {
	defer: true,
	fn(deferred) {
		got("http://localhost:8001")
		.then(() => {
			deferred.resolve();
		});
	}
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run();
