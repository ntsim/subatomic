import { expect } from 'chai';
import * as sinon from 'sinon';
import { InteractionListener } from '../src/InteractionListener';

describe('InteractionListener', () => {
    let canvasMock: any;
    let windowMock: any;
    let interactionListener: InteractionListener;

    beforeEach(() => {
        canvasMock = {
            element: {
                addEventListener() {}
            },
            context: {},
            width: null,
            height: null,
        };

        windowMock = {
            devicePixelRatio: 1
        };

        let canvas = <any> canvasMock;

        interactionListener = new InteractionListener(canvas, windowMock);
    });

    describe('setMouseListeners', () => {
        it('calls the canvas.element.addEventListener four times', () => {
            const spy = sinon.spy(canvasMock.element, 'addEventListener');

            interactionListener.setMouseListeners();

            expect(spy.callCount).to.be.eql(4);
        });

        it('attaches to the correct mouse events', () => {
            const spy = sinon.spy(canvasMock.element, 'addEventListener');
            interactionListener.setMouseListeners();
            expect(spy.calledWith('mousemove')).to.be.true;
            expect(spy.calledWith('mouseenter')).to.be.true;
            expect(spy.calledWith('mouseleave')).to.be.true;
            expect(spy.calledWith('click')).to.be.true;
        });
    });

    function getAddEventListenerCallback(listener: string): (e: any) => void {
        const spy = sinon.spy(canvasMock.element, 'addEventListener');
        spy.withArgs(listener);

        interactionListener.setMouseListeners();
        return <any> spy.withArgs(listener).args[0][1];
    }

    describe('onMouseMove', () => {
        it('sets the hoverPosition prop with offset coordinates', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 200,
                clientX: 500,
                clientY: 500,
            };

            const cb = getAddEventListenerCallback('mousemove');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(100);
            expect(interactionListener.hoverPosition.y).to.be.eql(200);
        });

        it('sets the hoverPosition with client coordinates when offset coordinates are not defined', () => {
            const testEvent = {
                clientX: 200,
                clientY: 400,
            };

            const cb = getAddEventListenerCallback('mousemove');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(200);
            expect(interactionListener.hoverPosition.y).to.be.eql(400);
        });

        it('scales the hoverPosition coordinates with the devicePixelRatio using offset coordinates', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 100,
            };

            windowMock.devicePixelRatio = 4;

            const cb = getAddEventListenerCallback('mousemove');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(400);
            expect(interactionListener.hoverPosition.y).to.be.eql(400);
        });

        it('scales the hoverPosition coordinates with the devicePixelRatio using client coordinates', () => {
            const testEvent = {
                clientX: 50,
                clientY: 100,
            };

            windowMock.devicePixelRatio = 3;

            const cb = getAddEventListenerCallback('mousemove');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(150);
            expect(interactionListener.hoverPosition.y).to.be.eql(300);
        });
    });

    describe('onMouseEnter', () => {
        it('sets the hoverPosition prop with offset coordinates', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 200,
                clientX: 500,
                clientY: 500,
            };

            const cb = getAddEventListenerCallback('mouseenter');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(100);
            expect(interactionListener.hoverPosition.y).to.be.eql(200);
        });

        it('sets the hoverPosition with client coordinates when offset coordinates are not defined', () => {
            const testEvent = {
                clientX: 200,
                clientY: 400,
            };

            const cb = getAddEventListenerCallback('mouseenter');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(200);
            expect(interactionListener.hoverPosition.y).to.be.eql(400);
        });

        it('scales the hoverPosition x and y coordinates with the devicePixelRatio using offset coordinates', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 100,
            };

            windowMock.devicePixelRatio = 4;

            const cb = getAddEventListenerCallback('mouseenter');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(400);
            expect(interactionListener.hoverPosition.y).to.be.eql(400);
        });

        it('scales the hoverPosition coordinates with the devicePixelRatio using client coordinates', () => {
            const testEvent = {
                clientX: 50,
                clientY: 100,
            };

            windowMock.devicePixelRatio = 3;

            const cb = getAddEventListenerCallback('mouseenter');
            cb(testEvent);

            expect(interactionListener.hoverPosition).not.to.be.null;
            expect(interactionListener.hoverPosition.x).to.be.eql(150);
            expect(interactionListener.hoverPosition.y).to.be.eql(300);
        });
    });

    describe('onMouseLeave', () => {
        it('sets the hoverPosition to null', () => {
            const testEvent = {
                clientX: 200,
                clientY: 400,
            };

            const cb = getAddEventListenerCallback('mouseleave');
            cb(testEvent);

            expect(interactionListener.hoverPosition).to.be.null;
        });
    });

    describe('onClick', () => {
        it('sets the clickTime prop to the current datetime', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 100,
            };

            const cb = getAddEventListenerCallback('click');
            cb(testEvent);

            expect(interactionListener.clickTime).to.be.eql(Date.now());
        });

        it('sets the clickPosition coordinates using the offset coordinates', () => {
            const testEvent = {
                offsetX: 100,
                offsetY: 100,
                clientX: 200,
                clientY: 200,
            };

            const cb = getAddEventListenerCallback('click');
            cb(testEvent);

            expect(interactionListener.clickPosition).not.to.be.null;
            expect(interactionListener.clickPosition.x).to.be.eql(100);
            expect(interactionListener.clickPosition.y).to.be.eql(100);
        });

        it('sets the clickPosition coordinates using the client coordinates if the offsets are not defined', () => {
            const testEvent = {
                clientX: 200,
                clientY: 200
            };

            const cb = getAddEventListenerCallback('click');
            cb(testEvent);

            expect(interactionListener.clickPosition).not.to.be.null;
            expect(interactionListener.clickPosition.x).to.be.eql(200);
            expect(interactionListener.clickPosition.y).to.be.eql(200);
        });

        it('scales the clickPosition x and y coordinates with the devicePixelRatio using offset coordinates', () => {
            const testEvent = {
                offsetX: 50,
                offsetY: 100,
            };

            windowMock.devicePixelRatio = 3;

            const cb = getAddEventListenerCallback('click');
            cb(testEvent);

            expect(interactionListener.clickPosition).not.to.be.null;
            expect(interactionListener.clickPosition.x).to.be.eql(150);
            expect(interactionListener.clickPosition.y).to.be.eql(300);
        });

        it('scales the clickPosition x and y coordinates with the devicePixelRatio using client coordinates', () => {
            const testEvent = {
                clientX: 100,
                clientY: 100,
            };

            windowMock.devicePixelRatio = 4;

            const cb = getAddEventListenerCallback('click');
            cb(testEvent);

            expect(interactionListener.clickPosition).not.to.be.null;
            expect(interactionListener.clickPosition.x).to.be.eql(400);
            expect(interactionListener.clickPosition.y).to.be.eql(400);
        });
    });
}) ;