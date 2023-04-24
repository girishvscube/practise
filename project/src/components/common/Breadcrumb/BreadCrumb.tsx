import * as React from 'react';
import { Link } from 'react-router-dom';
import { uuid } from '../../../utils/helpers';

interface Props {
  links: any
}

const BreadCrumb: React.FC<Props> = ({ links }) => (
  <div role="presentation">
    <p>
      {
        links.map((item, i, arr) => (i !== arr.length - 1 ? (
          <React.Fragment>
            <Link className="font-nunitoRegular text-xs text-textgray cursor-pointer" to={item.url}>
              {item.path}
            </Link>
            <span className="px-1 font-nunitoRegular text-xs text-textgray">{'>'}</span>
          </React.Fragment>
        ) : (
          <a className="font-nunitoRegular text-xs text-textgray">
            {item.path}
          </a>
        )))
      }
    </p>

  </div>
);

export default BreadCrumb;
