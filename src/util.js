// const base_url = 'http://127.0.0.1:8888'

export const getData = async (r, mask, distance, wash, isVaccine, vaccineBrand, vaccineDose, vaccineStrategy) => {
    let table_name = `1by20-r${r.toString()}-mask${mask.toString()}-wash${wash.toString()}-dist${distance.toString()}`
    if(isVaccine){
        table_name = `${table_name}-vaccon-${vaccineBrand}-${vaccineStrategy}-${vaccineDose}` 
    }
    else{
        table_name = table_name + '-vaccoff'
    }

    const endpoint = '/covid-sim-tool?table_name=' + table_name;
    console.log("finding data...: ", endpoint);

    try{
        const response =  await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const jsonResponse = await response.json();
        if(response.ok){
            console.log("Done!");
            return jsonResponse;
        }
        console.log("An error occurred: " + response.status);
        throw new Error(response.status);
    }
    catch(error){
        console.log(error.message);
        return "failed";
    }
}