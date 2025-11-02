class Limbs {
    /**
     * @param {Segment} baseSegment 
     */
    constructor(baseSegment) {
        this.baseSegment = baseSegment;
        this.root = this.baseSegment.p1;

        // Limb lengths
        this.upperLength = 30;
        this.lowerLength = 25;

        // Initialize joint and foot positions
        this.jointLeft = this.getJoint(Math.PI / 3);
        this.jointRight = this.getJoint(-Math.PI / 3);
        this.footLeft = this.getFoot(this.jointLeft, Math.PI / 1.5);
        this.footRight = this.getFoot(this.jointRight, -Math.PI / 1.5);

        // Create segments
        this.upperArmLeft = new Segment(this.root, this.jointLeft);
        this.upperArmRight = new Segment(this.root, this.jointRight);
        this.lowerArmLeft = new Segment(this.jointLeft, this.footLeft);
        this.lowerArmRight = new Segment(this.jointRight, this.footRight);

        // Walking state
        this.leftFootTarget = null;
        this.rightFootTarget = null;
        this.leftFootPlanted = true;
        this.rightFootPlanted = true;
        this.stepThreshold = 15; // Distance before taking a step
        this.stepHeight = 15; // How high to lift foot
        this.stepProgress = { left: 0, right: 0 }; // 0 to 1 for step animation

        this.calculate();
    }

    getOffset(angle, offsetLength) {
        return new Vector(
            Math.cos(angle) * offsetLength,
            Math.sin(angle) * offsetLength
        );
    }

    getJoint(offsetAngle, offsetLength = 20) {
        const segVector = this.baseSegment.getVector();
        const angle = segVector.angle();
        const jointAngle = angle + offsetAngle;
        const offset = this.getOffset(jointAngle, offsetLength);
        const jointPos = this.root.pos.add(offset);
        return new Point(jointPos, 3);
    }

    getFoot(joint, offsetAngle, length = 25) {
        const segVector = this.baseSegment.getVector();
        const angle = segVector.angle();
        const footAngle = angle + offsetAngle;
        const offset = this.getOffset(footAngle, length);
        const footPos = joint.pos.add(offset);
        return new Point(footPos, 3);
    }

    getIdealFootTarget(angle, offsetLength = 35) {
        const segVector = this.baseSegment.getVector();
        const bodyAngle = segVector.angle();
        const targetAngle = bodyAngle + angle;
        const offset = this.getOffset(targetAngle, offsetLength);
        const targetPos = this.root.pos.add(offset);
        return new Point(targetPos, 3);
    }

    // FABRIK algorithm to solve 2-joint IK
    solveIK(root, joint, foot, target, upperLen, lowerLen) {
        const totalLen = upperLen + lowerLen;
        const toTarget = target.pos.sub(root.pos);
        const distance = toTarget.mag();

        // If target is unreachable, stretch towards it
        if (distance > totalLen - 0.1) {
            const direction = toTarget.normalize();
            joint.pos = root.pos.add(direction.scale(upperLen));
            foot.pos = joint.pos.add(direction.scale(lowerLen));
            return;
        }

        // FABRIK: Forward reaching
        foot.pos = target.pos.clone();

        // Backward reaching phase
        for (let i = 0; i < 3; i++) {
            // Move joint to maintain lower arm length
            const footToJoint = joint.pos.sub(foot.pos);
            const dist = footToJoint.mag();
            if (dist > 0) {
                joint.pos = foot.pos.add(footToJoint.normalize().scale(lowerLen));
            }

            // Move joint to maintain upper arm length from root
            const rootToJoint = joint.pos.sub(root.pos);
            const rootDist = rootToJoint.mag();
            if (rootDist > 0) {
                joint.pos = root.pos.add(rootToJoint.normalize().scale(upperLen));
            }

            // Move foot to maintain lower arm length from joint
            const jointToFoot = foot.pos.sub(joint.pos);
            const jointDist = jointToFoot.mag();
            if (jointDist > 0) {
                foot.pos = joint.pos.add(jointToFoot.normalize().scale(lowerLen));
            }
        }
    }

    calculate() {
        // Get ideal target positions based on body orientation
        const leftIdeal = this.getIdealFootTarget(-Math.PI / 2.2, 40);
        const rightIdeal = this.getIdealFootTarget(Math.PI / 2.2, 40);

        // Initialize targets if null
        if (!this.leftFootTarget) {
            this.leftFootTarget = new Point(this.footLeft.pos.clone(), 3);
        }
        if (!this.rightFootTarget) {
            this.rightFootTarget = new Point(this.footRight.pos.clone(), 3);
        }

        // Check if feet should step (alternating gait)
        const leftDist = leftIdeal.pos.sub(this.footLeft.pos).mag();
        const rightDist = rightIdeal.pos.sub(this.footRight.pos).mag();

        // Left foot steps
        if (leftDist > this.stepThreshold && this.leftFootPlanted && this.rightFootPlanted) {
            this.leftFootPlanted = false;
            this.stepProgress.left = 0;
        }

        // Right foot steps (only if left is planted)
        if (rightDist > this.stepThreshold && this.rightFootPlanted && this.leftFootPlanted) {
            this.rightFootPlanted = false;
            this.stepProgress.right = 0;
        }

        // Animate stepping
        if (!this.leftFootPlanted) {
            this.stepProgress.left += 0.15;
            if (this.stepProgress.left >= 1) {
                this.stepProgress.left = 1;
                this.leftFootPlanted = true;
            }

            // Interpolate with arc
            const t = this.stepProgress.left;
            const start = this.footLeft.pos;
            const end = leftIdeal.pos;
            const mid = start.add(end.sub(start).scale(0.5));
            const heightOffset = Math.sin(t * Math.PI) * this.stepHeight;

            this.leftFootTarget.pos = start.add(end.sub(start).scale(t)).add(new Vector(0, -heightOffset));
        } else {
            this.leftFootTarget.pos = this.footLeft.pos.clone();
        }

        if (!this.rightFootPlanted) {
            this.stepProgress.right += 0.15;
            if (this.stepProgress.right >= 1) {
                this.stepProgress.right = 1;
                this.rightFootPlanted = true;
            }

            const t = this.stepProgress.right;
            const start = this.footRight.pos;
            const end = rightIdeal.pos;
            const heightOffset = Math.sin(t * Math.PI) * this.stepHeight;

            this.rightFootTarget.pos = start.add(end.sub(start).scale(t)).add(new Vector(0, heightOffset));
        } else {
            this.rightFootTarget.pos = this.footRight.pos.clone();
        }
    }

    update() {
        this.calculate();

        // Solve IK for both legs
        this.solveIK(
            this.root,
            this.jointLeft,
            this.footLeft,
            this.leftFootTarget,
            this.upperLength,
            this.lowerLength
        );

        this.solveIK(
            this.root,
            this.jointRight,
            this.footRight,
            this.rightFootTarget,
            this.upperLength,
            this.lowerLength
        );

        // Update segments
        this.upperArmLeft = new Segment(this.root, this.jointLeft);
        this.upperArmRight = new Segment(this.root, this.jointRight);
        this.lowerArmLeft = new Segment(this.jointLeft, this.footLeft);
        this.lowerArmRight = new Segment(this.jointRight, this.footRight);

        // this.upperArmLeft.applyAngleConstraint(this.lowerArmLeft);
        // this.upperArmRight.applyAngleConstraint(this.lowerArmRight);
    }

    draw(ctx) {
        // Draw limbs
        this.upperArmLeft.draw(ctx, { lineWidth: 6 });
        this.upperArmRight.draw(ctx, { lineWidth: 6 });
        this.lowerArmLeft.draw(ctx, { lineWidth: 6 });
        this.lowerArmRight.draw(ctx, { lineWidth: 6 });

        // Draw joints
        this.root.draw(ctx, { fill: true });
        this.jointLeft.draw(ctx, { fill: true });
        this.jointRight.draw(ctx, { fill: true });

        // Draw feet
        this.footLeft.draw(ctx, { fill: true });
        this.footRight.draw(ctx, { fill: true });

        // Draw targets (for debugging)
        this.leftFootTarget.draw(ctx);
        this.rightFootTarget.draw(ctx);
    }
}


/*

there is one problem with foot animation (stepping animation) 

let say this is the lizard 

  0   0
=======>
  0   0


the lower foot moves properly moving inward toward the body when it seps forward 
but the uper foot moves away from the body when it setps.
do you understand what i am saying  
*/