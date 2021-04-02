/** 
 * openLAMA is an open source platform which has been developed by the
 * Swiss Kanton Basel Landschaft, with the goal of automating and managing
 * large scale Covid testing programs or any other pandemic/viral infections.

 * Copyright(C) 2021 Kanton Basel Landschaft, Switzerland
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * See LICENSE.md in the project root for license information.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import { useState, useEffect, useRef } from 'react';

/**
 * Used to create an ResizeObserver in order to detect viewport side changes that will change the size of the observed component.
 * This is used for calculating DetailsList height in order to show an inner scroll.
 * @param {Ref} ref Ref of a component to get it's contentRect.width
 * @returns {Integer} returns the width of the Ref.
 */

const useGetElementWidth = (ref) => {
  const [elementWidth, setElementWidth] = useState(0);

  const observer = useRef(
    new ResizeObserver((entries) => {
      const { contentRect } = entries[0];
      setElementWidth(contentRect.width || 0);
    }),
  );

  useEffect(() => {
    if (ref && ref.current) {
      observer.current.observe(ref.current);
    }
    return () => {
      if (ref && ref.current) {
        observer.current.unobserve(ref.current);
      }
    };
  }, [ref, ref.current, observer]);

  useEffect(() => {
    return () => {
      observer.current.disconnect();
    };
  }, []);

  return elementWidth;
};

export default useGetElementWidth;
