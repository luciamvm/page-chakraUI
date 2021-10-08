import * as React from "react";
import _ from "lodash";
import { FormLabel, Select, Box, Button, Text, Center } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { SingleDatepicker } from "../components/datePicker";

export default function IndexPage()  {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const {register, handleSubmit} = useForm();
    const onSubmit = (d) =>
      alert(JSON.stringify(d));
  return(
    <div >
      <Head>
        <title>Reporting</title>

      </Head>
      
      <Center>
        <Text padding="70px" as='h2' fontSize='50px' color='#E53E44' isTruncated>Automate KOBU Reports</Text>
      </Center>
      
      <form onSubmit={handleSubmit(onSubmit)}>
      {/* <SimpleGrid columns={2} spacing="40px"> */}
        <Box w="300px" p={4}>
          <Text paddingBottom='30px' as="b" fontSize="lg">Choose for who is the report and the dates defined with him</Text>
          <FormLabel>Client</FormLabel>
          <Select {...register("client", {required: true})} placeholder='Chose an client..' size='md'>
            <option>Mar Shopping Algarve</option>
            <option>Tivoli Hotels</option>
            <option>Ombria Resort</option>
            <option>Designer Outlet Algarve</option>
          </Select>
        </Box>
        
        <Box w="300px" p={4} {...register("startdate", {required: true})}>
          <FormLabel>Start date</FormLabel>
          <SingleDatepicker value={currentDate} onChange={(date) => setCurrentDate(date)} />
        </Box>

        <Box w="300px" p={4} {...register("enddate", {required: true})}>
          <FormLabel>End date</FormLabel>
          <SingleDatepicker value={currentDate} onChange={(date) => setCurrentDate(date)} />
        </Box>

        <Button mt={4} colorScheme="teal" type="submit">Submit</Button>
      {/* </SimpleGrid> */}


      </form>

      <form method="post" action="/api/new" encType="multipart/form-data">
        <Box w="300px" p={4}>
          <Text paddingBottom='30px' as="b" fontSize="lg">Upload an corrected file</Text>
          <input name="logo" type="file"/>
          <Button mt={4} colorScheme="teal" type="submit">Submit</Button>
        </Box>
      </form>
    </div>

  )
}
