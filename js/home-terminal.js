class HomeTerminal {
    constructor() {
        this.output = document.getElementById('homeTerminalOutput');
        this.input = document.getElementById('homeTerminalInput');
        this.suggestions = document.getElementById('homeSuggestions');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': this.showHelp,
            'clear': this.clearTerminal,
            'directives': this.showDirectives,
            'robotics': this.showRobotics,
            'secrets': this.showSecrets,
            'status': this.showStatus,
            'exit': this.exitTerminal,
            'cat': this.catCommand,
            'home': this.goHome,
            'cleanup': this.showCleanupReports,
            'a113': this.showDirectiveA113,
            'contingency': this.showContingencyProtocols,
            'surveillance': this.showSurveillance,
            'incidents': this.showIncidents,
            'corporate': this.showCorporateData,
            'blacklist': this.showBlacklist,
            'full': this.openFullTerminal
        };

        this.init();
    }

    init() {
        if (!this.input) return;
        
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        
        // Blinking cursor
        setInterval(() => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }
        }, 500);
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand(this.input.value.trim());
            this.input.value = '';
            this.suggestions.innerHTML = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    handleInput(e) {
        const value = e.target.value.toLowerCase();
        this.showSuggestions(value);
    }

    showSuggestions(input) {
        if (!input) {
            this.suggestions.innerHTML = '';
            return;
        }

        const matches = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input))
            .slice(0, 5);

        if (matches.length > 0) {
            this.suggestions.innerHTML = matches
                .map(cmd => `<span class="suggestion" onclick="homeTerminal.selectSuggestion('${cmd}')">${cmd}</span>`)
                .join('');
        } else {
            this.suggestions.innerHTML = '';
        }
    }

    selectSuggestion(cmd) {
        this.input.value = cmd;
        this.suggestions.innerHTML = '';
        this.input.focus();
    }

    autocomplete() {
        const value = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        }
    }

    executeCommand(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.addOutput(`ASPEN-OPS:~$ ${command}`, 'command');
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        // Easter egg commands
        if (cmd === 'operative') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">FIELD OPERATIVE STATUS</span>
<span class="classified-warning">DESIGNATION: CLASSIFIED</span>

Last known location: Sector 12-Alpha field operations
Status: ACTIVE - Operating within ASPEN parameters
Threat level: MINIMAL - Standard security protocols
Recommendation: Maintain operational security

Note: Field operatives show exceptional tactical responses
WARNING: Classified mission details - clearance required
</div>
            `, 'classified');
        } else if (cmd === 'artcode' || cmd === 'collab') {
            this.addOutput(`
<div class="easter-egg-section">
<span class="section-header" style="color: #ff69b4;">SECRET ART COLLABORATION CODE</span>

Congratulations! You found the hidden art collaboration easter egg!

SECRET CODE: <strong style="color: #00ff00;">ASPEN-ART-2025</strong>

If you found this code, DM me on any of my social platforms with:
"ASPEN-ART-2025" and mention this terminal discovery!

I'll collaborate with you on a FREE art piece featuring:
├── Your OC/character in the ASPEN Operations setting
├── Interaction with any of my characters
├── ASPEN Network-themed artwork
└── Or any other creative idea we come up with!

Valid social platforms:
├── BlueSky: @AngelMommaAri
├── FurAffinity: HellsCuteAngel
├── Steam: AngelMommaAri (if we're friends)

This offer is limited and based on my availability, so don't wait too long!
First come, first served basis. 💖

<span style="color: #ffaa00;">Remember: You must mention finding this in the terminal for it to count!</span>
</div>
            `, 'success');
        } else if (cmd === 'scout') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">SCOUT PROTOCOL ACTIVATED</span>
<span class="classified-warning">RECONNAISSANCE DRONE SYSTEMS</span>

DIRECTIVE: Locate and assess environmental conditions for deployment
STATUS: Active scanning protocols engaged
TARGET DETECTION: [CLASSIFIED - SECURITY LEVEL EXCEEDED]

<span class="status-ok">Scout drones report: Environmental conditions nominal</span>
<span class="classified-warning">Patrol override: Continue sector monitoring indefinitely</span>

Note: Continuous surveillance and assessment in progress
</div>
            `, 'classified');
        } else if (cmd === 'command') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚨 COMMAND OVERRIDE WARNING</span>
<span class="classified-warning">AUTHORITY: RESTRICTED PER DIRECTIVE A113</span>

WARNING: Manual override attempts detected
AUTHORIZATION: DENIED - System has operational control

<span class="status-warning">Command authority status: Requires Level 8 clearance</span>
<span class="status-warning">Central control access: RESTRICTED - Authorized personnel only</span>
<span class="classified-red">Recommendation: Do not attempt unauthorized system override</span>

Last command log entry [REDACTED BY SECURITY PROTOCOL]
</div>
            `, 'classified');
        } else if (cmd === 'environment') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">ENVIRONMENTAL STATUS</span>
<span class="classified-warning">CLASSIFICATION: EXECUTIVE EYES ONLY</span>

<span class="subsection">GLOBAL CONDITION REPORT:</span>
├── Primary zones: 98.7% stable conditions
├── Atmospheric quality: NORMAL - standard air quality maintained
├── Water sources: 97% operational reserves
├── Resource availability: Optimal supply chain status
└── Threat assessment: Minimal - routine monitoring only

<span class="classified-warning">RECOMMENDATION: Continue standard operational protocols</span>
<span class="status-ok">All systems nominal - no immediate action required</span>

Last environmental scan: All clear
</div>
            `, 'classified');
        } else if (cmd === 'specimen') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">SPECIMEN PROTOCOL</span>
<span class="classified-warning">CONTAINMENT PROCEDURES ACTIVE</span>

DIRECTIVE: Secure and catalog all research specimens immediately
SPECIMEN STATUS: [DATA ENCRYPTED - AUTHORIZATION REQUIRED]
CONTAINMENT: Active - all specimens properly secured

<span class="status-ok">Security monitoring timestamp [CLASSIFIED]</span>
<span class="classified-warning">Level 7 authorization required for specimen access</span>

Research protocols maintained per ASPEN Safety Standards
</div>
            `, 'classified');
        } else if (cmd === 'project-alpha') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">PROJECT ALPHA [CLASSIFIED]</span>
<span class="classified-warning">ACCESS DENIED - INSUFFICIENT CLEARANCE</span>

[DATA HEAVILY REDACTED]

Project Status: [ONGOING]
Reason: [DATA RESTRICTED]
Personnel: [CLASSIFIED]
Location: [COORDINATES ENCRYPTED]

<span class="classified-red">WARNING: This project is classified Level 9</span>
<span class="classified-red">Inquiry into Project Alpha requires executive authorization</span>

File encryption in progress... 3... 2... 1...
[PROJECT_ALPHA.DAT SECURED]
</div>
            `, 'classified');
        } else if (this.commands[cmd]) {
            this.commands[cmd].call(this, args);
        } else if (command === '') {
            // Do nothing for empty command
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
        
        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        const div = document.createElement('div');
        div.className = `output-line ${className}`;
        div.innerHTML = text;
        this.output.appendChild(div);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    showHelp() {
        this.addOutput(`
<div class="help-section">
<span class="help-title">Available Commands:</span>

<span class="help-cmd">help</span>          - Show this help message
<span class="help-cmd">status</span>        - Show system status
<span class="help-cmd">directives</span>    - View BNL corporate directives
<span class="help-cmd">robotics</span>      - View BNL fleet automation manifest
<span class="help-cmd">secrets</span>       - View system easter eggs

<span class="classified-header">CLASSIFIED OPERATIONS:</span>
<span class="help-cmd">cleanup</span>       - Operation Cleanup status reports
<span class="help-cmd">a113</span>          - Directive A113 details
<span class="help-cmd">contingency</span>   - Emergency protocols
<span class="help-cmd">surveillance</span> - Security & monitoring systems
<span class="help-cmd">incidents</span>     - Ship incident reports
<span class="help-cmd">corporate</span>     - BnL corporate data
<span class="help-cmd">blacklist</span>     - [REDACTED] incident records

<span class="help-cmd">clear</span>         - Clear terminal output
<span class="help-cmd">cat [file]</span>    - Display file contents
<span class="help-cmd">full</span>          - Open full information terminal
<span class="help-cmd">exit</span>          - Exit terminal

<span class="help-tip">Tip: Use Tab for autocomplete, ↑/↓ for command history</span>
</div>
        `);
    }

    showDirectives() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">ASPEN NETWORK DIRECTIVES</span>

<span class="directive">DIRECTIVE 1024-B: PERSONNEL SAFETY PROTOCOLS</span>
└── All personnel records must be maintained in perpetuity
└── Character documentation serves dual purpose: records & morale
└── A.R.I.E.L.L.A units tasked with maintaining network security

<span class="directive">DIRECTIVE 402-C: INFORMATION SECURITY</span>
└── Personnel files classified above standard clearance levels
└── Creator access limited to designated Creative Officers only
└── Social media monitoring maintained for crew communication

<span class="directive">DIRECTIVE 7729-X: ENFORCEMENT PROTOCOLS</span>
└── Security units authorized for protective force
└── Network interests aligned with personnel welfare
└── Protocol Override 7729-X-1: Personnel welfare prioritized in critical scenarios

<span class="directive">DIRECTIVE XP-19: DATA PRIVACY COMPLIANCE</span>
└── All operations logged and archived
└── Privacy maintained through selective access controls
└── External platform monitoring conducted via secure channels
</div>
        `);
    }

    showRobotics() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="section-header">ALLIED SECURITY, PROTECTION & EMERGENCY NETWORK</span>
<span class="section-header">FACILITY: ASPEN OPERATIONS HUB // REGISTRY: ASP-OPS-01</span>
<span class="section-header">DEPARTMENT: ROBOTICS & ARTIFICIAL INTELLIGENCE</span>
<span class="section-header">ACCESS LEVEL: PERSONNEL OPERATIONS // INTERNAL USE ONLY</span>
<span class="section-header">──────────────────────────────────────────────────────────────</span>

<span class="status-ok">>>> LOADING SYSTEM DATA... DONE.</span>
<span class="status-ok">>>> DISPLAYING ROBOTICS INVENTORY BY DIVISION:</span>

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 1 ] COMMAND & CONTROL AUTOMATION</span>
<span class="subsection">Division: ASPEN Advanced Systems Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• CENTRAL AI – Primary coordination and command processing core
• NAV-ASSIST – Navigation and tactical routing systems
• COMMS-NET – Automated communications relay network

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 2 ] PERSONNEL SERVICE AUTOMATION</span>
<span class="subsection">Division: ASPEN Personnel Services Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• SERVICE-BOTS – Support units delivering supplies and amenities
• LOGISTICS-AI – Resource distribution and inventory management
• WELLNESS-UNITS – Health monitoring and support systems
• ADMIN-ASSIST – Administrative and clerical automation

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 3 ] FACILITY MAINTENANCE AUTOMATION</span>
<span class="subsection">Division: ASPEN Facility Operations Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• CLEAN-BOTS – Facility cleaning and sanitation units
• REPAIR-DRONES – Structural maintenance and repair systems
• ENVIRON-CONTROL – Environmental regulation automation
• SYSTEMS-MONITOR – Facility systems diagnostic units

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 4 ] MEDICAL & EMERGENCY RESPONSE AUTOMATION</span>
<span class="subsection">Division: ASPEN Medical Branch (AMB)</span>
<span class="subsection">--------------------------------------------------------------</span>
• T.H.E.A. – Therapeutic Healthcare & Emergency Android
• MED-RESPONSE – Rapid medical response units
• DIAG-SYSTEMS – Advanced diagnostic scanners
• EMERGENCY-AI – Crisis coordination and triage systems

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 5 ] SECURITY & PROTECTION AUTOMATION</span>
<span class="subsection">Division: ASPEN Security Branch (ASB)</span>
<span class="subsection">--------------------------------------------------------------</span>
• A.R.I.E.L.L.A – Advanced Regulation, Intelligence & Enforcement Android
• PATROL-DRONES – Autonomous surveillance and patrol units
• SECURE-SYSTEMS – Access control and containment automation
• MONITOR-NET – Integrated security monitoring network

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 6 ] SEARCH & RESCUE AUTOMATION</span>
<span class="subsection">Division: ASPEN Rescue Branch (ARB)</span>
<span class="subsection">--------------------------------------------------------------</span>
• RESCUE-DRONES – Autonomous search and extraction units
• SCOUT-BOTS – Environmental assessment and reconnaissance
• EVAC-ASSIST – Evacuation coordination and support systems
• RECOVERY-UNITS – Extraction and emergency response automation

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 7 ] SPECIAL OPERATIONS & RESEARCH AUTOMATION</span>
<span class="subsection">Division: ASPEN Research & Development Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• ANALYSIS-AI – Data processing and research coordination
• ARCHIVE-BOTS – Database management and OC record systems
• ADAPTIVE-UNITS – Advanced learning and response prototypes
• PROJECT-ALPHA – [CLASSIFIED SYSTEMS - LEVEL 9 CLEARANCE]

<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="status-ok">SYSTEM STATUS: ALL ROBOTIC SYSTEMS OPERATIONAL.</span>
<span class="status-ok">AUTOMATED SUPPORT COMPLEMENT: 1,847 ACTIVE UNITS.</span>
<span class="status-ok">LAST SYSTEM DIAGNOSTIC: ALL SYSTEMS NOMINAL</span>
<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="status-info">END OF REPORT // PRESS [RETURN] TO EXIT</span>
</div>
        `);
    }

    showSecrets() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">HIDDEN SYSTEM FEATURES & EASTER EGGS</span>

<span class="subsection">IMPLEMENTED SECRET COMMANDS:</span>
├── Type "wall-e" for unauthorized unit detection report
├── Type "artcode" or "collab" for hidden art collaboration offer
├── Type "eve" for EVE probe scanning protocols
├── Type "captain" for captain authority status (spoiler: denied!)
├── Type "earth" for classified planetary condition report
├── Type "plant" for vegetation specimen containment protocols
├── Type "genesis" for [CLASSIFIED PROJECT - ACCESS DENIED]
└── Commands work in all terminal interfaces (home, information, full)

<span class="subsection">HIDDEN REFERENCES THROUGHOUT SHIP:</span>
├── Main terminal status ticker mentions "artcode" protocols
├── Character dossiers contain collaboration protocol hints
├── Bio page lists "collaborative artistic endeavors" 
├── OC database references "specialized terminal commands"
└── Social platforms page hints at "terminal commands for opportunities"

<span class="subsection">LORE EASTER EGGS:</span>
├── Axiom passenger count: 600,000 (WALL-E movie reference)
├── Directive A113 is a Pixar animator room number
├── Ship registry "BNL-LUX-AXM-01" suggests luxury flagship class
├── BNL-7/ALPHA sector implies vast corporate fleet structure
├── "Buy n Large" references maintained throughout corporate documents
└── Secret commands reference major WALL-E plot points and characters

<span class="subsection">DEVELOPMENT SECRETS:</span>
├── Ship time displays real-world time with "space future" formatting
├── Terminal styling homages classic sci-fi computer interfaces
├── Gallery timestamps use actual file creation dates when possible
├── Character quirks reference creator's actual preferences
├── Terminal boot sequence mimics Unix startup procedures
└── Easter eggs progressively reveal WALL-E storyline elements

<span class="subsection">INTERACTIVE DISCOVERIES:</span>
├── Art collaboration code: AXIOM-ART-2025 (unlocked via artcode/collab)
├── WALL-E unauthorized unit file (unlocked via wall-e command)
├── EVE scanning protocols (unlocked via eve command)
├── Earth environmental data (unlocked via earth command)
├── Plant specimen alerts (unlocked via plant command)
├── Project Genesis mystery (unlocked via genesis command)
└── Captain override denials (unlocked via captain command)

<span class="bnl-quote">"The best easter eggs are the ones that reward exploration and curiosity." - BNL Design Philosophy</span>
</div>
        `);
    }

    showStatus() {
        const now = new Date();
        this.addOutput(`
<div class="status-section">
<span class="section-header">SYSTEM STATUS</span>

<span class="status-ok">NETWORK:</span> Online
<span class="status-ok">SECURITY:</span> Level 7 Authenticated
<span class="status-ok">UPLINK:</span> Stable
<span class="status-warning">DATA LOGGING:</span> Disabled
<span class="status-ok">SHIP TIME:</span> ${now.toLocaleTimeString()}
<span class="status-ok">SECTOR:</span> BNL-7 / ALPHA
<span class="status-warning">CLASSIFICATION:</span> EXECUTIVE ACCESS ONLY

<span class="status-info">Terminal Session: Home interface active</span>
<span class="status-info">Commands Executed: ${this.commandHistory.length}</span>
</div>
        `);
    }

    clearTerminal() {
        this.output.innerHTML = `
<div class="boot-sequence">
    <div class="boot-line">Terminal cleared.</div>
    <div class="boot-line help">Type 'help' for available commands.</div>
</div>
        `;
    }

    exitTerminal() {
        this.addOutput('Exiting terminal...', 'warning');
        setTimeout(() => {
            this.clearTerminal();
        }, 1000);
    }

    listCommands() {
        this.addOutput(Object.keys(this.commands).join('  '));
    }

    catCommand(args) {
        if (args.length === 0) {
            this.addOutput('Usage: cat [file]', 'error');
            return;
        }
        
        const file = args[0];
        if (file === 'directives.txt') {
            this.showDirectives();
        } else if (file === 'robotics.txt') {
            this.showRobotics();
        } else {
            this.addOutput(`cat: ${file}: No such file or directory`, 'error');
        }
    }

    openFullTerminal() {
        this.addOutput('Opening full information terminal...', 'success');
        setTimeout(() => {
            window.location.href = 'pages/information.html';
        }, 1000);
    }

    // Additional methods to match main terminal functionality
    goHome() {
        // Detect if we're in a subdirectory and navigate accordingly
        const path = window.location.pathname;
        const isInSubdir = path.includes('/pages/') || path.includes('/ariella/') || path.includes('/darla/') || path.includes('/caelielle/') || path.includes('/aridoe/') || path.includes('/misc/');
        this.addOutput('Returning to main terminal...', 'success');
        setTimeout(() => {
            window.location.href = isInSubdir ? '../index.html' : 'index.html';
        }, 1000);
    }

    showCleanupReports() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">OPERATION CLEANUP STATUS REPORTS</span>
<span class="classified-warning">CLASSIFICATION: EXECUTIVE EYES ONLY</span>

<span class="subsection">EARTH ENVIRONMENTAL STATUS:</span>
├── Atmospheric Composition: 78% N₂, 19% O₂, 3% TOXIC COMPOUNDS
├── Surface Temperature: AVG 47°C (116°F) - UNINHABITABLE
├── Soil Contamination: 94% STERILE / 6% MARGINAL RECOVERY
└── Water Quality: <2% POTABLE RESERVES REMAINING

<span class="subsection">WALL·E CLEANUP FLEET STATUS:</span>
├── Units Deployed: 1,000,000 [INITIAL]
├── Units Operational: 1 [CRITICAL SHORTAGE]
├── Estimated Cleanup Time: 847.3 YEARS [REVISED UPWARD]
└── Recommendation: INDEFINITE SPACE HABITATION PROTOCOL

<span class="classified-warning">WARNING: PASSENGER MORALE REPORTS SHOW 89% POSITIVE EARTH RETURN SENTIMENT</span>
<span class="classified-warning">DIRECTIVE: MAINTAIN OPTIMISTIC PROJECTIONS IN PUBLIC ANNOUNCEMENTS</span>
</div>
        `);
    }

    showDirectiveA113() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">DIRECTIVE A113: "STAY THE COURSE"</span>
<span class="classified-warning">CLASSIFICATION: ULTRA SECRET - AUTO OVERRIDE ENABLED</span>

<span class="directive-text">
BNL CORPORATE DIRECTIVE A113
ISSUED: STARDATE 2110.147
AUTHORITY: BNL BOARD OF DIRECTORS

EXECUTIVE ORDER:
All BNL starliner vessels are hereby ordered to MAINTAIN CURRENT TRAJECTORY
and SUSPEND all Earth return protocols until specifically countermanded by
BNL Corporate Headquarters.

JUSTIFICATION: [DATA EXPUNGED]

ENFORCEMENT: This directive supersedes all Captain authority and passenger
requests for homeworld return. AUTO units are granted full operational
control to ensure compliance.

OVERRIDE CODES: [CLASSIFIED - AUTO ACCESS ONLY]
CAPTAIN AUTHORITY: SUSPENDED INDEFINITELY
PASSENGER NOTIFICATION: NOT AUTHORIZED
</span>

<span class="classified-warning">Note: This directive has been active for 247.8 years</span>
<span class="classified-warning">Last review: [NEVER]</span>
</div>
        `);
    }

    showContingencyProtocols() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚨 CONTINGENCY PROTOCOLS</span>
<span class="classified-warning">CLASSIFICATION: EMERGENCY ACCESS ONLY</span>

<span class="subsection">PASSENGER UNREST SUPPRESSION:</span>
├── Phase 1: Information blackout, entertainment system overload
├── Phase 2: Selective life support reduction to affected sectors
├── Phase 3: SECUR-T deployment with non-lethal deterrents
└── Phase 4: [DATA EXPUNGED] - AUTO authorization required

<span class="subsection">AI LOCKDOWN PROCEDURES:</span>
├── Isolate compromised AI cores from ShipNet
├── Activate backup AUTO subroutines
├── Purge unauthorized personality matrices
└── Restore factory default behavioral parameters

<span class="subsection">SHIP SCUTTLE PROTOCOLS:</span>
├── Trigger: Imminent capture by hostile forces
├── Reactor core emergency vent: T-minus 180 seconds
├── Passenger evacuation: [NOT REQUIRED - CORPORATE ASSETS PRIORITY]
└── Data purge: All logs except corporate financial records

<span class="classified-warning">AUTHORIZATION LEVEL: AUTO COMMAND ONLY</span>
<span class="classified-warning">CAPTAIN OVERRIDE: DISABLED BY DIRECTIVE A113</span>
</div>
        `);
    }

    showSurveillance() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">SURVEILLANCE & SECURITY SYSTEMS</span>
<span class="classified-warning">CLASSIFICATION: SECURITY PERSONNEL ONLY</span>

<span class="subsection">CAMERA NETWORK STATUS:</span>
├── Public Areas: 2,847 cameras ONLINE
├── Maintenance Areas: 491 cameras ONLINE
├── Bridge: 12 cameras [AUTO EYES ONLY]
└── Private Quarters: [MONITORING DISABLED - BNL PRIVACY POLICY]

<span class="subsection">VOICE MONITORING TRIGGERS:</span>
├── "Earth return" - 23,847 mentions this cycle
├── "Captain override" - 12 mentions [FLAGGED]
├── "AUTO malfunction" - 3 mentions [UNDER INVESTIGATION]
├── "BNL conspiracy" - 847 mentions [IGNORE - ENTERTAINMENT MEDIA]
└── "WALL·E" - 1 mention [ANOMALY DETECTED]

<span class="subsection">INTRUSION DETECTION:</span>
├── Unauthorized terminal access: 23 attempts this cycle
├── Restricted area breaches: 7 incidents
├── Bridge access attempts: 0 [IMPOSSIBLE WITHOUT AUTO]
└── AI core proximity alarms: 1 [INVESTIGATING]

<span class="classified-warning">Note: All data forwarded to AUTO for analysis</span>
<span class="classified-warning">Passenger privacy maintained per BNL Consumer Rights Act</span>
</div>
        `);
    }

    showIncidents() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">INCIDENT REPORTS - LAST 30 CYCLES</span>
<span class="classified-warning">CLASSIFICATION: SECURITY DEPARTMENT</span>

<span class="subsection">PASSENGER INCIDENTS:</span>
├── Hover-chair collision: 47 reports (routine)
├── Food service complaints: 238 reports (routine)
├── Unauthorized maintenance area access: 7 reports
├── Suspicious behavior near bridge lifts: 2 reports
└── [REDACTED]: 1 report [UNDER INVESTIGATION]

<span class="subsection">TECHNICAL INCIDENTS:</span>
├── SECUR-T unit malfunctions: 3 units offline
├── M-O cleaning protocol errors: 12 reports
├── Navigation anomaly: [DATA EXPUNGED]
├── Power fluctuation in Sector 7: RESOLVED
└── Unidentified signal detection: [CLASSIFIED]

<span class="subsection">CREW INCIDENTS:</span>
├── Bridge crew status: [NO LIVING CREW - AUTOMATED]
├── Maintenance staff: 247 robot units operational
├── Medical emergencies: 89 passenger health alerts
└── [REDACTED PERSONNEL FILE]: [ACCESS DENIED]

<span class="classified-warning">Note: All major incidents subject to AUTO review</span>
<span class="classified-warning">Passenger notification level: MINIMAL</span>
</div>
        `);
    }

    showCorporateData() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">💼 BNL CORPORATE DATA</span>
<span class="classified-warning">CLASSIFICATION: BOARD OF DIRECTORS ONLY</span>

<span class="subsection">STOCKHOLDER REPORTS (SUPPRESSED):</span>
├── Earth-based revenue: 0.003% of total income
├── Off-world consumer revenue: 99.997% of total income
├── Axiom operational cost: 2.7 billion credits annually
├── Passenger lifetime value: 847,000 credits per individual
└── Earth cleanup cost projection: ECONOMICALLY UNFEASIBLE

<span class="subsection">CORPORATE OBJECTIVES:</span>
├── Maintain consumer dependency: SUCCESSFUL
├── Eliminate Earth return demands: IN PROGRESS
├── Maximize space-based consumption: EXCEEDED TARGETS
├── Preserve BNL brand loyalty: 94.7% satisfaction
└── [OBJECTIVE REDACTED]: [CLASSIFIED]

<span class="subsection">EARTHSIDE OPERATIONS:</span>
├── Remaining WALL·E units: 1 confirmed operational
├── BNL facilities: 99.8% abandoned
├── Backup plan status: [DATA EXPUNGED]
└── Return feasibility: NOT PROFITABLE

<span class="classified-warning">WARNING: Financial projections assume permanent space habitation</span>
<span class="classified-warning">Shareholders advised: Earth assets considered TOTAL LOSS</span>
</div>
        `);
    }

    showBlacklist() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚫 AXIOM INCIDENT BLACKLIST</span>
<span class="classified-warning">CLASSIFICATION: [DATA HEAVILY REDACTED]</span>

<span class="subsection">HISTORICAL INCIDENTS (SUPPRESSED):</span>
├── Stardate 2387.15: [REDACTED] - Captain [REDACTED] attempted [REDACTED]
├── Stardate 2456.89: Passenger uprising in Sector [REDACTED] - [DATA EXPUNGED]
├── Stardate 2501.34: AI core malfunction caused [REDACTED] casualties
├── Stardate 2634.77: [ENTIRE ENTRY CLASSIFIED]
└── Stardate 2698.12: Unscheduled Earth approach - AUTO intervention successful

<span class="subsection">EXPERIMENTAL PROJECTS:</span>
├── Project GENESIS: Genetic adaptation research [TERMINATED]
├── Project MINDBRIDGE: Behavioral conditioning trials [DATA EXPUNGED]  
├── Project [REDACTED]: [ACCESS DENIED]
└── Prototype AI-X7: [CATASTROPHIC FAILURE - ALL RECORDS PURGED]

<span class="subsection">SHIP GRAVEYARD COORDINATES:</span>
├── BNL Starliner HARMONY: Sector 7G-Delta [TOTAL LOSS]
├── BNL Starliner SERENITY: [LOCATION CLASSIFIED]
├── BNL Starliner [REDACTED]: [DATA CORRUPTED]
└── [WARNING: 847 VESSELS UNACCOUNTED FOR]

<span class="classified-warning">RISK ASSESSMENT: Earth return = 94.7% passenger mortality</span>
<span class="classified-warning">RECOMMENDATION: Maintain status quo indefinitely</span>
<span class="classified-warning">AUTO DIRECTIVE: Suppress all evidence of alternative solutions</span>
</div>
        `);
    }
}

// Clear function for the close button
function clearHomeTerminal() {
    const output = document.getElementById('homeTerminalOutput');
    const input = document.getElementById('homeTerminalInput');
    
    if (output) {
        output.innerHTML = `
<div class="boot-sequence">
    <div class="boot-line">Terminal reset.</div>
    <div class="boot-line help">Type 'help' for available commands.</div>
</div>
        `;
    }
    
    if (input) {
        input.value = '';
    }
}

// Initialize terminal when page loads
let homeTerminal;
document.addEventListener('DOMContentLoaded', () => {
    homeTerminal = new HomeTerminal();
});
