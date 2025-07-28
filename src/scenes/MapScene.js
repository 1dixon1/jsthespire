import * as PIXI from 'pixi.js';

export class MapScene {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.gameState = game.getGameState();
        
        this.background = null;
        this.nodes = [];
        this.paths = [];
        this.currentNode = null;
        this.playerPosition = null;
        
        // Map scrolling
        this.mapContainer = new PIXI.Container();
        this.mapContainer.x = 0;
        this.mapContainer.y = 0;
        
        // Scrolling state
        this.mapOffset = { x: 0, y: 0 };
        
        // Available paths highlighting
        this.availablePaths = [];
        this.highlightedPaths = [];
    }

    init() {
        // Background
        const bgTexture = this.game.app.loader?.resources?.['bg_map'];
        this.background = new PIXI.Sprite(bgTexture || this.createBackground());
        this.background.width = 1280;
        this.background.height = 720;
        this.container.addChild(this.background);

        // Add map container to main container
        this.container.addChild(this.mapContainer);

        this.createMap();
        this.createUI();
        this.setupScrolling();
    }

    setupScrolling() {
        console.log('Setting up scrolling...');
        
        // Enable events for mapContainer but disable dragging
        this.mapContainer.eventMode = 'static';
        this.mapContainer.cursor = 'default';
        
        console.log('MapContainer eventMode set to static');
        
        // Disable dragging by not adding drag event handlers
        // But keep the container interactive for child elements
        
        // Add wheel scrolling only
        this.container.eventMode = 'static';
        this.container.on('wheel', (event) => {
            event.preventDefault();
            const scrollSpeed = 50;
            
            if (event.deltaY > 0) {
                // Scroll right
                this.mapOffset.x = Math.max(-800, this.mapOffset.x - scrollSpeed);
            } else {
                // Scroll left
                this.mapOffset.x = Math.min(0, this.mapOffset.x + scrollSpeed);
            }
            
            this.mapContainer.x = this.mapOffset.x;
            this.mapContainer.y = this.mapOffset.y;
        });
        
        console.log('Wheel scrolling set up');
        
        // Add scroll indicators
        this.addScrollIndicators();
    }

    addScrollIndicators() {
        // Left scroll indicator
        const leftIndicator = new PIXI.Graphics();
        leftIndicator.beginFill(0x000000, 0.5);
        leftIndicator.lineStyle(2, 0xffffff);
        leftIndicator.drawRoundedRect(0, 300, 40, 120, 10);
        leftIndicator.endFill();
        
        const leftArrow = new PIXI.Text('◀', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        leftArrow.anchor.set(0.5);
        leftArrow.x = 20;
        leftArrow.y = 360;
        leftIndicator.addChild(leftArrow);
        
        this.container.addChild(leftIndicator);
        
        // Right scroll indicator
        const rightIndicator = new PIXI.Graphics();
        rightIndicator.beginFill(0x000000, 0.5);
        rightIndicator.lineStyle(2, 0xffffff);
        rightIndicator.drawRoundedRect(1240, 300, 40, 120, 10);
        rightIndicator.endFill();
        
        const rightArrow = new PIXI.Text('▶', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        rightArrow.anchor.set(0.5);
        rightArrow.x = 1260;
        rightArrow.y = 360;
        rightIndicator.addChild(rightArrow);
        
        this.container.addChild(rightIndicator);
    }

    createMap() {
        // Create a larger, more strategic map
        const mapLayout = this.generateMapLayout();
        
        this.nodes = mapLayout.nodes.map((nodeData, index) => {
            return this.createNode(nodeData.x, nodeData.y, nodeData.type, index);
        });

        // Create paths between connected nodes
        mapLayout.paths.forEach(path => {
            const pathElement = this.createPath(this.nodes[path.from], this.nodes[path.to]);
            this.paths.push(pathElement);
            this.mapContainer.addChild(pathElement);
        });

        // Add nodes to container
        this.nodes.forEach(node => {
            this.mapContainer.addChild(node.container);
        });

        // Set starting position
        this.currentNode = 0;
        this.nodes[0].visited = false; // Ensure first node is not visited
        this.createPlayerIndicator();
        this.updatePlayerPosition();
        this.highlightAvailablePaths();
        
        console.log(`Map created with ${this.nodes.length} nodes, starting at node ${this.currentNode}`);
    }

    generateMapLayout() {
        const layout = {
            nodes: [],
            paths: []
        };

        // Define map structure with strategic branching
        const nodePositions = [
            // Starting area (Floor 1)
            { x: 100, y: 350, type: 'start' },
            
            // First branch (Floor 2)
            { x: 250, y: 200, type: 'combat' },
            { x: 250, y: 500, type: 'combat' },
            
            // Second branch (Floor 3)
            { x: 400, y: 150, type: 'combat' },
            { x: 400, y: 350, type: 'elite' },
            { x: 400, y: 550, type: 'combat' },
            
            // Third branch (Floor 4)
            { x: 550, y: 100, type: 'combat' },
            { x: 550, y: 250, type: 'shop' },
            { x: 550, y: 450, type: 'combat' },
            { x: 550, y: 600, type: 'rest' },
            
            // Fourth branch (Floor 5)
            { x: 700, y: 200, type: 'combat' },
            { x: 700, y: 400, type: 'elite' },
            { x: 700, y: 500, type: 'combat' },
            
            // Fifth branch (Floor 6)
            { x: 850, y: 150, type: 'combat' },
            { x: 850, y: 300, type: 'shop' },
            { x: 850, y: 450, type: 'rest' },
            { x: 850, y: 550, type: 'combat' },
            
            // Sixth branch (Floor 7)
            { x: 1000, y: 250, type: 'combat' },
            { x: 1000, y: 400, type: 'elite' },
            { x: 1000, y: 500, type: 'combat' },
            
            // Final approach (Floor 8)
            { x: 1150, y: 200, type: 'combat' },
            { x: 1150, y: 350, type: 'rest' },
            { x: 1150, y: 500, type: 'combat' },
            
            // Boss (Floor 9)
            { x: 1300, y: 350, type: 'boss' }
        ];

        // Create nodes with balanced types
        layout.nodes = nodePositions.map((pos, index) => {
            let nodeType = pos.type;
            
            // Ensure balanced distribution
            if (pos.type === 'combat') {
                // Add some variety to combat nodes
                const variants = ['combat', 'combat', 'combat', 'elite'];
                nodeType = variants[Math.floor(Math.random() * variants.length)];
            }
            
            return {
                x: pos.x,
                y: pos.y,
                type: nodeType
            };
        });

        // Define strategic paths with multiple routes
        const pathConnections = [
            // Floor 1 to 2
            { from: 0, to: 1 }, { from: 0, to: 2 },
            
            // Floor 2 to 3
            { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 2, to: 5 },
            
            // Floor 3 to 4
            { from: 3, to: 6 }, { from: 4, to: 7 }, { from: 4, to: 8 }, { from: 5, to: 9 },
            
            // Floor 4 to 5
            { from: 6, to: 10 }, { from: 7, to: 10 }, { from: 7, to: 11 }, { from: 8, to: 11 }, { from: 9, to: 12 },
            
            // Floor 5 to 6
            { from: 10, to: 13 }, { from: 10, to: 14 }, { from: 11, to: 15 }, { from: 12, to: 16 },
            
            // Floor 6 to 7
            { from: 13, to: 17 }, { from: 14, to: 17 }, { from: 14, to: 18 }, { from: 15, to: 18 }, { from: 16, to: 19 },
            
            // Floor 7 to 8
            { from: 17, to: 20 }, { from: 18, to: 21 }, { from: 19, to: 22 },
            
            // Floor 8 to Boss
            { from: 20, to: 23 }, { from: 21, to: 23 }, { from: 22, to: 23 }
        ];

        layout.paths = pathConnections;

        return layout;
    }

    createNode(x, y, type, index) {
        const node = {
            x: x,
            y: y,
            type: type,
            index: index,
            container: new PIXI.Container(),
            visited: false
        };

        node.container.x = x;
        node.container.y = y;

        // Node background
        const bg = new PIXI.Graphics();
        let color;
        let size = 25;
        
        switch (type) {
            case 'start':
                color = 0x4ecdc4;
                size = 30;
                break;
            case 'combat':
                color = 0xff6b6b;
                break;
            case 'elite':
                color = 0xfdcb6e;
                size = 30;
                break;
            case 'shop':
                color = 0x74b9ff;
                break;
            case 'rest':
                color = 0x00b894;
                break;
            case 'boss':
                color = 0xe17055;
                size = 35;
                break;
            default:
                color = 0x6c5ce7;
        }

        bg.beginFill(color);
        bg.lineStyle(3, 0xffffff);
        bg.drawCircle(0, 0, size);
        bg.endFill();
        node.container.addChild(bg);

        // Add glow effect for special nodes
        if (type === 'elite' || type === 'boss') {
            const glow = new PIXI.Graphics();
            glow.lineStyle(2, 0xffffff, 0.5);
            glow.drawCircle(0, 0, size + 5);
            glow.endFill();
            node.container.addChild(glow);
            
            // Animate glow
            let scale = 1.0;
            const pulse = () => {
                scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.1;
                glow.scale.set(scale);
                requestAnimationFrame(pulse);
            };
            pulse();
        }

        // Node icon
        const icon = new PIXI.Text(this.getNodeIcon(type), {
            fontFamily: 'Arial',
            fontSize: type === 'boss' ? 24 : 20,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        icon.anchor.set(0.5);
        node.container.addChild(icon);

        // Node label
        const label = new PIXI.Text(type.toUpperCase(), {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        label.anchor.set(0.5);
        label.y = size + 15;
        node.container.addChild(label);

        // Floor number for strategic planning
        const floorNumber = Math.floor(index / 3) + 1;
        const floorText = new PIXI.Text(`F${floorNumber}`, {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 1
        });
        floorText.anchor.set(0.5);
        floorText.y = -(size + 15);
        node.container.addChild(floorText);

        // Make interactive (except start node)
        if (type !== 'start') {
            node.container.eventMode = 'static';
            node.container.cursor = 'pointer';
            
            console.log(`Setting up events for node ${index} (${type})`);

            node.container.on('pointerdown', () => {
                console.log(`Node ${index} clicked!`);
                this.selectNode(index);
            });

            node.container.on('pointerover', () => {
                console.log(`Node ${index} hovered`);
                bg.scale.set(1.2);
            });

            node.container.on('pointerout', () => {
                console.log(`Node ${index} unhovered`);
                bg.scale.set(1.0);
            });
        } else {
            console.log(`Start node ${index} is not interactive`);
        }

        return node;
    }

    getNodeIcon(type) {
        switch (type) {
            case 'start':
                return '🚀';
            case 'combat':
                return '⚔';
            case 'elite':
                return '👹';
            case 'shop':
                return '💰';
            case 'rest':
                return '🏕';
            case 'boss':
                return '👑';
            default:
                return '?';
        }
    }

    createPath(fromNode, toNode) {
        const path = new PIXI.Graphics();
        path.lineStyle(3, 0xffffff, 0.5);
        path.moveTo(fromNode.x, fromNode.y);
        path.lineTo(toNode.x, toNode.y);
        
        // Store path data for highlighting
        path.fromNode = fromNode;
        path.toNode = toNode;
        
        return path;
    }

    selectNode(index) {
        console.log(`selectNode called with index: ${index}`);
        const node = this.nodes[index];
        
        if (!node) {
            console.log(`Node ${index} does not exist`);
            return;
        }
        
        console.log(`Node ${index} type: ${node.type}, visited: ${node.visited}`);
        
        // Check if node is reachable
        if (!this.isNodeReachable(index)) {
            console.log(`Node ${index} is not reachable from current position ${this.currentNode}`);
            return;
        }

        if (node.visited) {
            console.log(`Node ${index} has already been visited`);
            return;
        }

        console.log(`Moving to node ${index} (${node.type})`);

        // Move to node
        this.currentNode = index;
        node.visited = true;
        this.updatePlayerPosition();
        this.highlightAvailablePaths();

        // Handle node type
        this.handleNodeType(node.type);
    }

    isNodeReachable(targetIndex) {
        // Get all nodes that are connected to the current node
        const reachableNodes = this.getConnectedNodes(this.currentNode);
        return reachableNodes.includes(targetIndex);
    }

    getConnectedNodes(nodeIndex) {
        const connected = [];
        
        // Find all paths that connect to this node
        this.paths.forEach((path, pathIndex) => {
            const pathData = this.getPathData(pathIndex);
            if (pathData) {
                if (pathData.from === nodeIndex) {
                    connected.push(pathData.to);
                } else if (pathData.to === nodeIndex) {
                    connected.push(pathData.from);
                }
            }
        });
        
        return connected;
    }

    getPathData(pathIndex) {
        // This would need to be implemented based on how paths are stored
        // For now, we'll use a simple approach
        const pathConnections = [
            // Floor 1 to 2
            { from: 0, to: 1 }, { from: 0, to: 2 },
            
            // Floor 2 to 3
            { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 2, to: 5 },
            
            // Floor 3 to 4
            { from: 3, to: 6 }, { from: 4, to: 7 }, { from: 4, to: 8 }, { from: 5, to: 9 },
            
            // Floor 4 to 5
            { from: 6, to: 10 }, { from: 7, to: 10 }, { from: 7, to: 11 }, { from: 8, to: 11 }, { from: 9, to: 12 },
            
            // Floor 5 to 6
            { from: 10, to: 13 }, { from: 10, to: 14 }, { from: 11, to: 15 }, { from: 12, to: 16 },
            
            // Floor 6 to 7
            { from: 13, to: 17 }, { from: 14, to: 17 }, { from: 14, to: 18 }, { from: 15, to: 18 }, { from: 16, to: 19 },
            
            // Floor 7 to 8
            { from: 17, to: 20 }, { from: 18, to: 21 }, { from: 19, to: 22 },
            
            // Floor 8 to Boss
            { from: 20, to: 23 }, { from: 21, to: 23 }, { from: 22, to: 23 }
        ];
        
        return pathConnections[pathIndex];
    }

    handleNodeType(type) {
        switch (type) {
            case 'start':
                // Start node - just move to it, no special action
                console.log('Starting the journey!');
                break;
            case 'combat':
            case 'elite':
                console.log(`Starting ${type} encounter`);
                this.game.switchScene('combat');
                break;
            case 'shop':
                console.log('Entering shop');
                this.showShop();
                break;
            case 'rest':
                console.log('Resting at campfire');
                this.showRest();
                break;
            case 'boss':
                console.log('Facing the boss!');
                this.game.switchScene('combat');
                break;
        }
    }

    showShop() {
        // Create shop overlay
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.8);
        overlay.drawRect(0, 0, 1280, 720);
        overlay.endFill();
        this.container.addChild(overlay);

        const shopText = new PIXI.Text('SHOP', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });
        shopText.anchor.set(0.5);
        shopText.x = 640;
        shopText.y = 200;
        this.container.addChild(shopText);

        const goldText = new PIXI.Text(`Gold: ${this.gameState.player.gold}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xfdcb6e,
            stroke: 0x000000,
            strokeThickness: 2
        });
        goldText.anchor.set(0.5);
        goldText.x = 640;
        goldText.y = 280;
        this.container.addChild(goldText);

        // Shop items
        const items = [
            { name: 'Heal Potion', cost: 50, effect: 'Heal 20 HP' },
            { name: 'Energy Potion', cost: 75, effect: 'Gain 2 Energy' },
            { name: 'Card Pack', cost: 100, effect: 'Add 3 random cards' }
        ];

        const shopElements = [shopText, goldText];

        items.forEach((item, index) => {
            const itemButton = this.createShopItem(item, 400 + index * 200, 400, goldText);
            this.container.addChild(itemButton);
            shopElements.push(itemButton);
        });

        // Continue button
        const continueButton = this.createButton('CONTINUE', 640, 600, () => {
            // Clean up shop elements
            shopElements.forEach(element => {
                if (element && element.parent) {
                    element.parent.removeChild(element);
                }
            });
            
            if (overlay && overlay.parent) {
                overlay.parent.removeChild(overlay);
            }
            
            // Recreate UI
            this.createUI();
        });
        this.container.addChild(continueButton);
        shopElements.push(continueButton);
    }

    createShopItem(item, x, y, goldText) {
        const button = new PIXI.Container();
        button.x = x;
        button.y = y;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x74b9ff);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-80, -60, 160, 120, 10);
        bg.endFill();
        button.addChild(bg);

        const nameText = new PIXI.Text(item.name, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        nameText.anchor.set(0.5);
        nameText.y = -30;
        button.addChild(nameText);

        const costText = new PIXI.Text(`${item.cost} Gold`, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xfdcb6e,
            stroke: 0x000000,
            strokeThickness: 1
        });
        costText.anchor.set(0.5);
        costText.y = -10;
        button.addChild(costText);

        const effectText = new PIXI.Text(item.effect, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 1
        });
        effectText.anchor.set(0.5);
        effectText.y = 10;
        button.addChild(effectText);

        button.eventMode = 'static';
        button.cursor = 'pointer';

        button.on('pointerdown', () => {
            if (this.gameState.player.gold >= item.cost) {
                this.gameState.player.gold -= item.cost;
                // Apply item effect
                if (item.name === 'Heal Potion') {
                    this.gameState.heal(20);
                }
                // Update gold display
                goldText.text = `Gold: ${this.gameState.player.gold}`;
            }
        });

        return button;
    }

    showRest() {
        // Heal player
        this.gameState.heal(30);

        // Show rest message
        const restText = new PIXI.Text('REST SITE', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0x00ff00,
            stroke: 0x000000,
            strokeThickness: 4
        });
        restText.anchor.set(0.5);
        restText.x = 640;
        restText.y = 300;
        this.container.addChild(restText);

        const healText = new PIXI.Text('You healed 30 HP!', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        healText.anchor.set(0.5);
        healText.x = 640;
        healText.y = 380;
        this.container.addChild(healText);

        setTimeout(() => {
            this.container.removeChild(restText);
            this.container.removeChild(healText);
        }, 2000);
    }

    createPlayerIndicator() {
        this.playerPosition = new PIXI.Container();
        this.mapContainer.addChild(this.playerPosition);
        
        // Player glow effect
        this.playerGlow = new PIXI.Graphics();
        this.playerGlow.beginFill(0x00ff00, 0.3);
        this.playerGlow.lineStyle(2, 0x00ff00, 0.8);
        this.playerGlow.drawCircle(0, 0, 25);
        this.playerGlow.endFill();
        this.playerPosition.addChild(this.playerGlow);
        
        // Player main circle
        this.playerCircle = new PIXI.Graphics();
        this.playerCircle.beginFill(0x00ff00);
        this.playerCircle.lineStyle(3, 0xffffff);
        this.playerCircle.drawCircle(0, 0, 20);
        this.playerCircle.endFill();
        this.playerPosition.addChild(this.playerCircle);

        // Player icon
        this.playerIcon = new PIXI.Text('👤', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        this.playerIcon.anchor.set(0.5);
        this.playerPosition.addChild(this.playerIcon);
        
        // Animate player glow
        this.animatePlayerGlow();
    }

    animatePlayerGlow() {
        let scale = 1.0;
        const animate = () => {
            scale = 1.0 + Math.sin(Date.now() * 0.003) * 0.2;
            this.playerGlow.scale.set(scale);
            requestAnimationFrame(animate);
        };
        animate();
    }

    updatePlayerPosition() {
        if (this.currentNode !== null && this.nodes[this.currentNode]) {
            const currentNode = this.nodes[this.currentNode];
            console.log(`Updating player position to node ${this.currentNode} at (${currentNode.x}, ${currentNode.y})`);
            this.playerPosition.x = currentNode.x;
            this.playerPosition.y = currentNode.y;
        } else {
            console.log(`Cannot update player position: currentNode=${this.currentNode}, nodes[${this.currentNode}]=${this.nodes[this.currentNode]}`);
        }
    }

    highlightAvailablePaths() {
        // Clear previous highlights
        this.clearPathHighlights();
        
        // Get available nodes
        const availableNodes = this.getConnectedNodes(this.currentNode);
        console.log(`Available nodes from ${this.currentNode}:`, availableNodes);
        
        // Highlight paths to available nodes
        this.paths.forEach((path, pathIndex) => {
            const pathData = this.getPathData(pathIndex);
            if (pathData && availableNodes.includes(pathData.to)) {
                this.highlightPath(path);
            }
        });
        
        // Highlight available nodes
        availableNodes.forEach(nodeIndex => {
            if (this.nodes[nodeIndex] && !this.nodes[nodeIndex].visited) {
                this.highlightNode(this.nodes[nodeIndex]);
            }
        });
    }

    highlightPath(path) {
        // Create highlight overlay that matches the path
        const highlight = new PIXI.Graphics();
        highlight.lineStyle(4, 0x00ff00, 0.4);
        
        // Use stored path data
        if (path.fromNode && path.toNode) {
            highlight.moveTo(path.fromNode.x, path.fromNode.y);
            highlight.lineTo(path.toNode.x, path.toNode.y);
        }
        
        highlight.endFill();
        
        // Add to the beginning of mapContainer so it's behind nodes
        this.mapContainer.addChildAt(highlight, 0);
        this.highlightedPaths.push(highlight);
    }

    highlightNode(node) {
        // Add subtle background glow first (behind the node)
        const bgGlow = new PIXI.Graphics();
        bgGlow.beginFill(0x00ff00, 0.15);
        bgGlow.drawCircle(node.x, node.y, 40);
        bgGlow.endFill();
        
        // Add to the beginning so it's behind the node
        this.mapContainer.addChildAt(bgGlow, 0);
        this.highlightedPaths.push(bgGlow);
        
        // Add a subtle outline glow
        const glow = new PIXI.Graphics();
        glow.lineStyle(2, 0x00ff00, 0.6);
        glow.drawCircle(node.x, node.y, 32);
        glow.endFill();
        
        // Add to the end of mapContainer to ensure it's on top but not interfering
        this.mapContainer.addChild(glow);
        this.highlightedPaths.push(glow);
    }



    clearPathHighlights() {
        this.highlightedPaths.forEach(highlight => {
            if (highlight.parent) {
                highlight.parent.removeChild(highlight);
            }
        });
        this.highlightedPaths = [];
    }

    createUI() {
        // Floor info
        const currentFloor = Math.floor(this.currentNode / 3) + 1;
        const floorText = new PIXI.Text(`Floor ${currentFloor}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        floorText.x = 50;
        floorText.y = 50;
        this.container.addChild(floorText);

        // Progress indicator
        const progressText = new PIXI.Text(`Progress: ${this.currentNode + 1}/${this.nodes.length}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 1
        });
        progressText.x = 50;
        progressText.y = 80;
        this.container.addChild(progressText);

        // Player stats
        const statsText = new PIXI.Text(`HP: ${this.gameState.player.currentHealth}/${this.gameState.player.maxHealth} | Gold: ${this.gameState.player.gold}`, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        statsText.x = 50;
        statsText.y = 110;
        this.container.addChild(statsText);

        // Map legend
        this.createMapLegend();

        // Menu button
        const menuButton = this.createButton('MENU', 1200, 50, () => {
            this.game.switchScene('mainMenu');
        });
        this.container.addChild(menuButton);
    }

    createMapLegend() {
        const legendY = 650;
        const legendItems = [
            { icon: '🚀', label: 'Start', color: 0x4ecdc4 },
            { icon: '⚔', label: 'Combat', color: 0xff6b6b },
            { icon: '👹', label: 'Elite', color: 0xfdcb6e },
            { icon: '💰', label: 'Shop', color: 0x74b9ff },
            { icon: '🏕', label: 'Rest', color: 0x00b894 },
            { icon: '👑', label: 'Boss', color: 0xe17055 }
        ];

        legendItems.forEach((item, index) => {
            const legendItem = new PIXI.Container();
            legendItem.x = 50 + index * 150;
            legendItem.y = legendY;

            // Icon background
            const bg = new PIXI.Graphics();
            bg.beginFill(item.color);
            bg.lineStyle(2, 0xffffff);
            bg.drawCircle(0, 0, 15);
            bg.endFill();
            legendItem.addChild(bg);

            // Icon
            const icon = new PIXI.Text(item.icon, {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 1
            });
            icon.anchor.set(0.5);
            legendItem.addChild(icon);

            // Label
            const label = new PIXI.Text(item.label, {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 1
            });
            label.anchor.set(0.5);
            label.y = 25;
            legendItem.addChild(label);

            this.container.addChild(legendItem);
        });
    }

    createButton(text, x, y, onClick) {
        const button = new PIXI.Container();
        button.x = x;
        button.y = y;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x74b9ff);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-50, -20, 100, 40, 10);
        bg.endFill();
        button.addChild(bg);

        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        buttonText.anchor.set(0.5);
        button.addChild(buttonText);

        button.eventMode = 'static';
        button.cursor = 'pointer';

        button.on('pointerdown', () => {
            bg.tint = 0x5f9ea0;
        });

        button.on('pointerup', () => {
            bg.tint = 0xffffff;
            onClick();
        });

        button.on('pointerover', () => {
            bg.tint = 0x87ceeb;
        });

        button.on('pointerout', () => {
            bg.tint = 0xffffff;
        });

        return button;
    }

    createBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 720);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);

        return canvas;
    }

    cleanup() {
        // Clean up highlighted paths
        this.clearPathHighlights();
        
        // Clean up nodes
        this.nodes.forEach(node => {
            if (node.container && node.container.parent) {
                node.container.parent.removeChild(node.container);
            }
            node.container.destroy({ children: true });
        });
        
        // Clean up paths
        this.paths.forEach(path => {
            if (path && path.parent) {
                path.parent.removeChild(path);
            }
            path.destroy();
        });
        
        // Clean up player position
        if (this.playerPosition && this.playerPosition.parent) {
            this.playerPosition.parent.removeChild(this.playerPosition);
            this.playerPosition.destroy({ children: true });
        }
        
        // Clean up map container
        if (this.mapContainer && this.mapContainer.parent) {
            this.mapContainer.parent.removeChild(this.mapContainer);
        }
        
        // Reset state
        this.nodes = [];
        this.paths = [];
        this.playerPosition = null;
        this.highlightedPaths = [];
        this.currentNode = null;
        this.mapOffset = { x: 0, y: 0 };
    }

    update() {
        // Map doesn't need continuous updates
    }

    handleResize() {
        // Map is fixed size
    }
} 