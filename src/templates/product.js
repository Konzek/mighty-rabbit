import React from 'react';
import _ from 'lodash';
import { graphql } from 'gatsby';
import components, {Layout} from '../components/index';
import { classNames, withPrefix, htmlToReact } from '../utils';
// this minimal GraphQL query ensures that when 'gatsby develop' is running,
// any changes to content files are reflected in browser
export const query = graphql`
  query($url: String) {
    sitePage(path: {eq: $url}) {
      id
    }
  }
`;

export default class Product extends React.Component {
	render() {
		let has_image = false;
		let image_pos = _.get(this.props, 'pageContext.frontmatter.image_position', null) || 'top';
		if (_.get(this.props, 'pageContext.frontmatter.image', null)) {
			has_image = true;
		}
		return (
			<Layout {...this.props}>
				<article className="post py-5 py-sm-6 py-md-7">
					<div className={classNames('post__hero', 'container', { 'container--medium': (image_pos === 'top') || (has_image === false) })}>
						<div className={classNames('mb-4', { 'mb-md-5': image_pos !== 'top', 'mb-md-6': image_pos !== 'top', 'grid': image_pos !== 'top', 'items-center': has_image && (image_pos !== 'top') })}>
							{has_image && (
								<div style={{
									display: 'flex',
									justifyContent: 'center'
								}} className={classNames('post__image', 'mb-3', { 'cell-12': image_pos !== 'top', 'cell-lg-7': image_pos !== 'top', 'mb-lg-0': image_pos !== 'top' })}>
									<img src={withPrefix(_.get(this.props, 'pageContext.frontmatter.image', null))} alt={_.get(this.props, 'pageContext.frontmatter.image_alt', null)} />
								</div>
							)}
							<header className={classNames('post__header', { 'cell-12': image_pos !== 'top', 'cell-lg-5': image_pos !== 'top', 'order-lg-first': has_image && (image_pos === 'right') })}>

								<h1 className="post__title mt-0">{_.get(this.props, 'pageContext.frontmatter.title', null)}</h1>
								{_.get(this.props, 'pageContext.frontmatter.subtitle', null) && (
									<p className="post__subtitle">{_.get(this.props, 'pageContext.frontmatter.subtitle', null)}</p>
								)}
							</header>
						</div>
					</div>
					<div className="container container--medium">
						<div className="post__body text-block">
							{htmlToReact(_.get(this.props, 'pageContext.html', null))}
						</div>
					</div>
				</article>
				{_.map(_.get(this.props, 'pageContext.frontmatter.sections', null), (section, section_idx) => {
					let component = _.upperFirst(_.camelCase(_.get(section, 'type', null)));
					let Component = components[component];
					return (
						<Component key={section_idx} {...this.props} section={section} site={this.props.pageContext.site} />
					)
				})}
			</Layout>
		);
	}
}
