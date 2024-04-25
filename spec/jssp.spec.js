const { JSDOM } = require('jsdom');

// Setup jsdom environment once and use it throughout
const dom = new JSDOM(`
<html>
  <body>
    <div id="name"></div>
    <div id="score">0</div>
    <div id="player"></div>
    <div class="robo"><div style="top: 9vh; left: 50vw;"></div></div>
  </body>
</html>`);
global.window = dom.window;
global.document = window.document;

// Mock global functions used in the module
global.prompt = jasmine.createSpy('promptSpy').and.returnValue("Test Player");
global.alert = jasmine.createSpy('alertSpy');

const obj = require('../jssp');  // Import your game logic module

describe("Game object tests", function() {
    var spaceship, robots, speeds, curr;

    beforeEach(function() {
        document.body.innerHTML = `
        <div id="name"></div>
        <div id="score">0</div>
        <div id="player"></div>
        <div class="robo"><div style="top: 9vh; left: 50vw;"></div></div>`;

        spaceship = document.querySelector("#player");
        robots = document.querySelectorAll(".robo>div");
        speeds = [2];
        curr = [9];

        spaceship.style.top = "60vh";
        spaceship.style.left = "50vw";
        robots.forEach(robot => {
            robot.style.top = "9vh";
            robot.style.left = "50vw";
        });
    });

    describe("obj.reset function", function() {
        it("should reset game values and prompt for new player name", function() {
            obj.reset();

            expect(global.prompt).toHaveBeenCalled();
            expect(document.querySelector("#name").innerHTML).toEqual("Test Player");
            expect(document.querySelector("#score").innerHTML).toEqual("0");
            expect(spaceship.style.top).toEqual("60vh");
            expect(spaceship.style.left).toEqual("50vw");
            expect(global.alert).toHaveBeenCalledWith("Test Player, sorry! You DIED!");
        });
    });

    describe("obj.f function", function() {
        it("should move the spaceship down when 's' key is pressed", function() {
            const event = document.createEvent('Event');
            event.initEvent('keypress', true, true);
            event.key = 's';
            window.dispatchEvent(event);
            expect(spaceship.style.top).toBeGreaterThan("60vh");
        });

        it("should not move beyond boundary when 'w' key is pressed at the top edge", function() {
            spaceship.style.top = "8vh"; // Ensure this is indeed the upper boundary in your game logic
            const event = document.createEvent('Event');
            event.initEvent('keypress', true, true);
            event.key = 'w';
            window.dispatchEvent(event);
            expect(spaceship.style.top).toEqual("8vh"); // Confirm no movement occurs
        });
    });
});
