import React, { useState } from 'react';
import { Grid, Box, Text } from '@/common';
import styled from 'styled-components';
import { ReactComponent as Achievement1SVG } from '@/svgs/achievment1.svg';
import { ReactComponent as Achievement2SVG } from '@/svgs/achievment2.svg';
import { ReactComponent as Achievement3SVG } from '@/svgs/achievment3.svg';
import { ReactComponent as Achievement4SVG } from '@/svgs/achievment4.svg';
import { ReactComponent as Achievement5SVG } from '@/svgs/achievment5.svg';
import { ReactComponent as Achievement6SVG } from '@/svgs/achievment6.svg';
import { ReactComponent as Achievement7SVG } from '@/svgs/achievment7.svg';

interface AchievementProps {
  style:
    | {
        filter?: undefined;
      }
    | {
        filter: string;
      };
  title: string;
}

const Achievement1 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement1SVG style={props.style} />
  </div>
);
const Achievement2 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement2SVG style={props.style} />
  </div>
);
const Achievement3 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement3SVG style={props.style} />
  </div>
);
const Achievement4 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement4SVG style={props.style} />
  </div>
);
const Achievement5 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement5SVG style={props.style} />
  </div>
);
const Achievement6 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement6SVG style={props.style} />
  </div>
);
const Achievement7 = (props: AchievementProps) => (
  <div title={props.title}>
    <Achievement7SVG style={props.style} />
  </div>
);

const achievementsComponents = [
  { Component: Achievement1, title: '첫 승리(승리 1회)' },
  { Component: Achievement2, title: '마스터 오브 고스트퐁퐁(승리 100회)' },
  { Component: Achievement3, title: '우와 이긴횟수가 42회다(승리 42회)' },
  { Component: Achievement4, title: '42번이나 지다니!!!(패배 42회' },
  { Component: Achievement5, title: '나는 이제 누군가의 친구다!(첫 친구)' },
  { Component: Achievement6, title: '나도 이제 인싸인가?? 흫흐흫흫(친구 10명)' },
  { Component: Achievement7, title: '인싸생활 힘들어...(친구 42명)' },
];

interface AchievementBoxProps {
  achievements: number[];
}

export const AchievementBox = ({ achievements }: AchievementBoxProps) => {
  return (
    <Box as="section">
      <Grid
        container="flex"
        direction="column"
        justifyContent="start"
        alignItems="start"
        gap={1.5}
        size={{ height: '100%', width: '100rem', padding: 'lg' }}
      >
        <Text size="lg">업적</Text>
        <Grid container="flex" justifyContent="start" alignItems="start" gap={5} size={{ height: '100%' }}>
          {achievementsComponents.map(({ Component, title }, index) => {
            const style = achievements.includes(index + 1) ? {} : { filter: 'grayscale(100%)' };
            return <Component key={index} style={style} title={title} />;
          })}
        </Grid>
      </Grid>
    </Box>
  );
};
