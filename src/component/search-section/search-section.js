import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box} from '@material-ui/core';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import DiseaseSetting from './disease-setting';
import PolicySetting from './policy-setting';

const useStyles = makeStyles((theme) =>({
    title:{
        textAlign: 'center',
        fontWeight: 'bold',
        gutterBottom: true,
        fontSize: theme.typography.h3.fontSize
    },
    wrapper: {
        position: "relative",
        backgroundColor: theme.palette.common.white,
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    container: {
        marginRight: theme.spacing(10),
        marginLeft: theme.spacing(15),
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    settingContainer: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
    extraLargeButtonLabel: {
        fontSize: theme.typography.h5.fontSize
    },
    extraLargeButton: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        margin: 'auto',
        borderRadius: "5em",
        minWidth: 300
    }
  }));

export default function SearchSection(props){
    const {onClick} = props;
    const classes = useStyles();
    const [r, setR] = useState("3");
    const [mask, setMask] = useState("0");
    const [distance, setDistance] = useState("0");
    const [wash, setWash] = useState("0");
    const [isVaccine, setIsVaccine] = useState(false)
    const [vaccineBrand, setVaccineBrand] = useState("A");
    const [vaccineDose, setVaccineDose] = useState("10M");
    const [vaccineStrategy, setVaccineStrategy] = useState("1");
    const icu_admission = [0, 4.2, 10.4, 11.2, 18.8, 31, 29];
    const hospotalization = [2.5, 20.8, 28.3, 30.1, 43.5, 58.7, 70.3];
    const fatality = [0, 0.2, 0.8, 2.6, 4.9, 10.5, 27.3];
    const [ratios, setRatios] = useState([
        {
            key: 'icu',
            values: icu_admission
        },
        {
            key: 'hospital',
            values: hospotalization
        },
        {
            key: 'fatality',
            values: fatality
        }
    ]);
    const handleRChange = (rValue) =>{
        setR(rValue);
    };

    const handleRatiosChange = (key, sliderId, value) =>{
        const newRatio = ratios.map( ratio => {
            if(ratio.key === key){
                let prevValue = ratio['values'];
                prevValue[sliderId] = value;
                return {...ratio, values: prevValue};
            }
            else{
                return {...ratio};
            }
        });
        console.log(newRatio);
        setRatios(newRatio);
    }

    const handleMaskChange = (maskValue) =>{
        setMask(maskValue);
    };
    const handleDistanceChange = (distanceValue) =>{
        setDistance(distanceValue);
    };
    const handleWashChange = (washValue) =>{
        setWash(washValue);
    };
    const handleIsVaccineChange = (isVaccineValue) =>{
        setIsVaccine(isVaccineValue);
    };

    const handleVaccineBrandChange = (vaccineBrandValue) =>{
        setVaccineBrand(vaccineBrandValue);
    };

    const handleVaccineDoseChange = (vaccineDoseValue) =>{
        setVaccineDose(vaccineDoseValue);
    };

    const handleVaccineStrategyChange = (vaccineStrategyValue) =>{
        setVaccineStrategy(vaccineStrategyValue);
    };


      const percentage_20_marks = [
        {
            value: 0,
            label: '0%'
        },
        {
            value: 20,
            label: ''
        },
        {
            value: 40,
            label: ''
        },
        {
            value: 60,
            label: ''
        },
        {
            value: 80,
            label: ''
        },
        {
            value: 100,
            label: '100%'
        }
      ];

    const handleClick = () =>{
        onClick(r, mask, distance, wash, isVaccine, vaccineBrand, vaccineDose, vaccineStrategy, ratios);
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <DiseaseSetting 
                    handleRChange={handleRChange}
                    handleRatiosChange={handleRatiosChange}
                    icu_admission={icu_admission}
                    hospotalization={hospotalization}
                    fatality={fatality}
                />
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                >
                    <PolicySetting
                        percentage_20_marks={percentage_20_marks}
                        handleMaskChange={handleMaskChange}
                        handleDistanceChange={handleDistanceChange}
                        handleWashChange={handleWashChange}
                        handleIsVaccineChange={handleIsVaccineChange}
                        handleVaccineBrandChange={handleVaccineBrandChange}
                        handleVaccineDoseChange={handleVaccineDoseChange}
                        handleVaccineStrategyChange={handleVaccineStrategyChange}

                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.extraLargeButton}
                        classes={{ label: classes.extraLargeButtonLabel }}
                        startIcon={<PlayCircleFilledWhiteIcon />}
                        onClick={handleClick}
                    >
                        開始模擬
                    </Button>  
                </Box>
            </div>
        </div>
    );
}