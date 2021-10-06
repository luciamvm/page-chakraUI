import * as React from "react";
import _ from "lodash";
import { FormControl, FormLabel, Select, ChakraProvider, Box, Button, Divider, Heading, HStack, Input, Popover, PopoverBody, PopoverContent,
  PopoverTrigger, SimpleGrid, Text, useOutsideClick, VStack, Flex, Center } from "@chakra-ui/react";
import { DateObj, useDayzed, RenderProps, GetBackForwardPropsOptions, Calendar } from "dayzed";
import * as dateFns from "date-fns";
import { useForm } from 'react-hook-form';
import Head from 'next/head';


// Creating a DatePicker with https://codesandbox.io/s/quizzical-sammet-rs450?file=/src/index.tsx
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DATE_FORMAT = "dd/MM/yyyy";

interface SingleDatepickerBackButtonsProps {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

const SingleDatepickerBackButtons = (
  props: SingleDatepickerBackButtonsProps
) => {
  const { calendars, getBackProps } = props;
  return (
    <>
      <Button
        {...getBackProps({
          calendars,
          offset: 12
        })}
        variant="ghost"
        size="sm"
      >
        {"<<"}
      </Button>
      <Button {...getBackProps({ calendars })} variant="ghost" size="sm">
        {"<"}
      </Button>
    </>
  );
};

interface SingleDatepickerForwardButtonsProps {
  calendars: Calendar[];
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

const SingleDatepickerForwardButtons = (
  props: SingleDatepickerForwardButtonsProps
) => {
  const { calendars, getForwardProps } = props;
  return (
    <>
      <Button {...getForwardProps({ calendars })} variant="ghost" size="sm">
        {">"}
      </Button>
      <Button
        {...getForwardProps({
          calendars,
          offset: 12
        })}
        variant="ghost"
        size="sm"
      >
        {">>"}
      </Button>
    </>
  );
};

const SingleDatepickerCalendar = (props: RenderProps) => {
  const { calendars, getDateProps, getBackProps, getForwardProps } = props;

  if (_.isEmpty(calendars)) {
    return null;
  }

  return (
    <Box>
      <HStack spacing={6} alignItems="baseline">
        {_.map(calendars, (calendar) => {
          return (
            <VStack key={`${calendar.month}${calendar.year}`}>
              <HStack>
                <SingleDatepickerBackButtons
                  calendars={calendars}
                  getBackProps={getBackProps}
                />
                <Heading size="xs" textAlign="center">
                  {MONTH_NAMES[calendar.month]} {calendar.year}
                </Heading>
                <SingleDatepickerForwardButtons
                  calendars={calendars}
                  getForwardProps={getForwardProps}
                />
              </HStack>
              <Divider />
              <SimpleGrid columns={7} spacing={1} textAlign="center">
                {_.map(DAY_NAMES, (day) => (
                  <Box key={`${calendar.month}${calendar.year}${day}`}>
                    <Text fontSize="xs" fontWeight="semibold">
                      {day}
                    </Text>
                  </Box>
                ))}
                {_.map(calendar.weeks, (week, weekIndex) => {
                  return _.map(week, (dateObj: DateObj, index) => {
                    const {
                      date,
                      today,
                      prevMonth,
                      nextMonth,
                      selected
                    } = dateObj;

                    const key = `${calendar.month}${calendar.year}${weekIndex}${index}`;
                    const isDisabled = prevMonth || nextMonth;

                    const style = () => {
                      const obj: LooseObject = {
                        variant: "outline",
                        borderColor: "transparent"
                      };

                      if (today) {
                        obj.borderColor = "purple.400";
                      }

                      if (selected) {
                        obj.bg = "purple.200";
                      }

                      return obj;
                    };

                    return (
                      <Button
                        {...getDateProps({
                          dateObj,
                          disabled: isDisabled
                        })}
                        key={key}
                        size="xs"
                        {...style()}
                      >
                        {date.getDate()}
                      </Button>
                    );
                  });
                })}
              </SimpleGrid>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};

export interface SingleDatepickerProps {
  value?: Date;
  disabled?: boolean;
  onChange: (date?: Date) => void;
}

export const SingleDatepicker = (props: SingleDatepickerProps) => {
  const { value, disabled, onChange } = props;

  const ref = React.useRef<HTMLElement>(null);
  const initialFocusRef = React.useRef<HTMLInputElement>(null);

  const [proposedDate, setProposedDate] = React.useState<string>(
    value ? dateFns.format(value, DATE_FORMAT) : ""
  );
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  useOutsideClick({
    ref: ref,
    handler: () => setPopoverOpen(false)
  });

  const onChangePrime = (date?: Date) => {
    onChange(date);
    if (date) {
      setProposedDate(dateFns.format(date, DATE_FORMAT));
    }
  };

  const onDateSelected = (options: { selectable: boolean; date: Date}) => {
    const { selectable, date } = options;

    if (!selectable) {
      return;
    }

    if (!_.isNil(date)) {
      onChangePrime(date);
      setPopoverOpen(false);
      return;
    }
  };

  const dayzedData = useDayzed({
    showOutsideDays: true,
    onDateSelected,
    selected: value
  });

  return (
    <Popover
      placement="bottom-start"
      variant="responsive"
      isOpen={popoverOpen}
      onClose={() => setPopoverOpen(false)}
      initialFocusRef={initialFocusRef}
      isLazy
    >
      <PopoverTrigger>
        <Input
          bg="white"
          value={proposedDate}
          isDisabled={disabled}
          ref={initialFocusRef}
          onClick={() => setPopoverOpen(!popoverOpen)}
          onChange={(e) => {
            setProposedDate(e.target.value);
          }}
          onBlur={() => {
            const d = dateFns.parse(proposedDate, DATE_FORMAT, new Date());
            dateFns.isValid(d) ? onChangePrime(d) : onChangePrime(undefined);
          }}
        />
      </PopoverTrigger>
      <PopoverContent ref={ref}>
        <PopoverBody>
          <SingleDatepickerCalendar {...dayzedData} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};





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
