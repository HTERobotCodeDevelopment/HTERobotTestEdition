


//% color="#50A820" weight=10 icon="\uf0c2"
namespace HTERobot{

    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04
    const PRESCALE = 0xFE
    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09
    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD
     
    const STP_CHA_L = 2047
    const STP_CHA_H = 4095

    const STP_CHB_L = 1
    const STP_CHB_H = 2047

    const STP_CHC_L = 1023
    const STP_CHC_H = 3071

    const STP_CHD_L = 3071
    const STP_CHD_H = 1023



    export enum ExpandDigitalPins {
        D0 = 0,
        D1 = 1,
        D2 = 2,
        D3 = 3,
        D4 = 4,
        A0 = 5,
        A1 = 6,
        A2 = 7
    }

    export enum ExpandAnalogPins {
        A0 = 0,
        A1 = 1,
        A2 = 2
    }


    export enum Servos {
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08
    }

    export enum Motors {
        MA = 0x1,
        MB = 0x2
    }

    let initialized = false

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50);
        for (let idx = 0; idx < 16; idx++) {
			setPwm(idx, 0 ,0);
		}
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    function stopMotor(index: number) {
        setPwm((index - 1) * 2, 0, 0);
        setPwm((index - 1) * 2 + 1, 0, 0);
    }


    /**
     * 拓展数字引脚读入函数
     * @param index eg: D0-D4
     */
    //% blockId=ExpandDigitalPinInPut block="Digital Read ExpandPin |%index"
    //% weight=60
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ExpandDigitalPinInPut(index: ExpandDigitalPins) :number{
        if(index == 0)
        {
            return pins.digitalReadPin(DigitalPin.P8);
        }
        else if(index == 1)
        {
            return pins.digitalReadPin(DigitalPin.P13);
        }
        else if(index == 2)
        {
            return pins.digitalReadPin(DigitalPin.P14);
        }
        else if(index == 3)
        {
            return pins.digitalReadPin(DigitalPin.P15);
        }
        else if(index == 4)
        {
            return pins.digitalReadPin(DigitalPin.P16);
        }
        else if(index == 5)
        {
            return pins.digitalReadPin(DigitalPin.P0);
        }
        else if(index == 6)
        {
            return pins.digitalReadPin(DigitalPin.P1);
        }
        else if(index == 7)
        {
            return pins.digitalReadPin(DigitalPin.P2);
        }
        else 
            return 0;

    } 

    /**
     * 拓展数字引脚输出函数
     * @param index index eg: D0-D4
     * @param Value value is 0 or 1
     */
    //% blockId=ExpandDigitalPinOutPut block="Digital Write ExpandPin|%index|to|%Value"
    //% weight=59
    //% blockGap=40
    //% Value.min=0 Value.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ExpandDigitalPinOutPut(index: ExpandDigitalPins, Value:number) :void{
        if(index == 0)
        {
            pins.digitalWritePin(DigitalPin.P8,Value);
        }
        else if(index == 1)
        {
            pins.digitalWritePin(DigitalPin.P13,Value);
        }
        else if(index == 2)
        {
            pins.digitalWritePin(DigitalPin.P14,Value);
        }
        else if(index == 3)
        {
            pins.digitalWritePin(DigitalPin.P15,Value);
        }
        else if(index == 4)
        {
            pins.digitalWritePin(DigitalPin.P16,Value);
        }
        else if(index == 5)
        {
            pins.digitalWritePin(DigitalPin.P0,Value);
        }
        else if(index == 6)
        {
            pins.digitalWritePin(DigitalPin.P1,Value);
        }
        else if(index == 7)
        {
            pins.digitalWritePin(DigitalPin.P2,Value);
        }

    } 

    
    /**
     * 拓展模拟引脚读入函数
     * @param index eg:A0,A1,A2
     */
    //% blockId=ExpandAnalogPinInPut block="Analog Read ExpandPin |%index"
    //% weight=58
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ExpandAnalogPinInPut(index: ExpandAnalogPins) :number{
        if(index == 0)
        {
            return pins.analogReadPin(AnalogPin.P0);
        }
        else if(index == 1)
        {
            return pins.analogReadPin(AnalogPin.P1);
        }
        else if(index == 2)
        {
            return pins.analogReadPin(AnalogPin.P2);
        }
        else
            return 0;
    } 


    /**
     * 拓展模拟引脚输出函数
     * @param index  eg:A0,A1,A2
     * @param Value   value is 0-1024
     */
    //% blockId=ExpandAnalogPinOutPut block="Analog Write ExpandPin|%index| to |%Value"
    //% weight=57
    //% blockGap=40
    //% Value.min=0 Value.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function ExpandAnalogPinOutPut(index: ExpandAnalogPins, Value:number) :void{
        if(index == 0)
        {
            pins.analogWritePin(AnalogPin.P0,Value);
        }
        else if(index == 1)
        {
            pins.analogWritePin(AnalogPin.P1,Value);
        }
        else if(index == 2)
        {
            pins.analogWritePin(AnalogPin.P2,Value);
        }
    } 


   



    /**
	 * 舵机打角0-180度
	 * @param index Servo Channel; eg: S1
	 * @param Degree [0-180] Degree of servo; eg: 0, 90, 180
	*/
    //% blockId=HTERobot_servo block="Servo|%index|Degree %Degree"
    //% weight=49
    //% Degree.min=0 Degree.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Servo(index: Servos, Degree: number): void {
        if (!initialized) {
            initPCA9685()
        }
        // 50hz: 20,000 us
        let v_us = (Degree * 1800 / 180 + 600) // 0.6 ~ 2.4
        let value = v_us * 4096 / 20000
        setPwm(index + 7, 0, value)
    }
    /**
	 * 舵机打角0.0-180.0度
	 * @param index Servo Channel; eg: S1
	 * @param Degree [0.0-180.0] Degree of servo; eg: 0, 900, 1800
	*/
    //% blockId=HTERobot_servoAccurate block="ServoAccurate|%index|DegreeAcurrate %DegreeAcurrate"
    //% weight=48
    //% blockGap=40
    //% DegreeAcurrate.min=0 DegreeAcurrate.max=1800
    export function ServoAccurate(index: Servos, DegreeAcurrate: number): void {
        if (!initialized) {
            initPCA9685()  
        }
        // 50hz: 20,000 us
        let v_us = (DegreeAcurrate + 600) // 0.6 ~ 2.4
        let value = v_us * 4096 / 20000
        setPwm(index + 7, 0, value)
    }
    
  

    /**
     * 电机运行速度-255~255
     */
    //% blockId=HTERobot_motor_run block="Motor|%index|speed %speed"
    //% weight=39
    //% speed.min=-255 speed.max=255
    export function MotorRun(index: Motors, speed: number): void {
        if (!initialized) {
            initPCA9685()
        }
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }
        if (index > 2 || index <= 0)
            return
        let pp = (index - 1) * 2
        let pn = (index - 1) * 2 + 1
        if (speed >= 0) {
            if (index == 1) {
                setPwm(pp, 0, 0)
                setPwm(pn, 0, speed) 
            } else {
                setPwm(pp, 0, speed)
                setPwm(pn, 0, 0)
            }
        } else {
            if (index == 1) {
                setPwm(pp, 0, -speed)
                setPwm(pn, 0, 0)
            } else if (index == 2) {
                setPwm(pp, 0, 0)
                setPwm(pn, 0, -speed) 
            }
            
        }
    }



    /**
     * Motor Run With a delay
     * 
     */
    //% blockId=HTERobot_motor_rundelay block="Motor|%index|speed %speed|delay %delay|s"
    //% weight=38
    //% speed.min=-255 speed.max=255
    export function MotorRunDelay(index: Motors, speed: number, delay: number): void {
        MotorRun(index, speed);
        basic.pause(delay * 1000);
        MotorRun(index, 0);
    }

    /**
     * Motor Stop
     */
    //% blockId=HTERobot_stop block="Motor Stop|%index|"
    //% weight=37
    //% blockGap=40
    export function MotorStop(index: Motors): void {
        MotorRun(index, 0);
    }

    
    /**
     * HTERobot_i2cwriteReg
     */
    //% blockId=HTERobot_i2cwriteReg block="DeviceAddr|%addr|Reg %reg|Value %value"
    //% weight=29
    export function i2cwriteReg(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }


    /**
     * HTERobot_i2creadReg
     */
    //% blockId=HTERobot_i2creadReg block="DeviceAddr|%addr|Reg %reg"
    //% weight=28
    //% blockGap=40
    export function i2creadReg(addr: number, reg: number): number{
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }


   
}