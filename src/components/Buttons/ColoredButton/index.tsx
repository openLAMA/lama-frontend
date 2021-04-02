import React from 'react';

// Material UI
import { Button, ButtonProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'var(--backgroundColor)',
    borderColor: 'var(--backgroundColor)',
    '&:hover': {
      backgroundColor: 'var(--hoverBackgroundColor)',
    },

    color: 'var(--textColor)',
  },
});

interface IColoredButtonProps extends ButtonProps {
  className?: string;
  textColor?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
}

const ColoredButton: React.FC<IColoredButtonProps> = (
  props: IColoredButtonProps,
) => {
  const classes = useStyles();

  const {
    className,
    textColor = '#fff',
    backgroundColor = '#EE2629',
    hoverBackgroundColor = '#A61A1C',
    ...rest
  } = props;

  const colorStyles = {
    '--textColor': textColor,
    '--backgroundColor': backgroundColor,
    '--hoverBackgroundColor': hoverBackgroundColor,
  } as React.CSSProperties;

  return (
    <Button
      className={`${className} ${classes.root}`}
      style={colorStyles}
      {...rest}
    />
  );
};

export default ColoredButton;
